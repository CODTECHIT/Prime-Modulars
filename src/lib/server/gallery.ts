import { createServerFn } from "@tanstack/react-start";
import { getDb } from "../db";
import { ObjectId } from "mongodb";
import { verifyToken } from "../admin-auth";
import { checkRateLimit, sanitizeObject } from "../security";

export interface GalleryImage {
  _id?: string;
  src: string;
  publicId: string;
  category: string;
  caption: string;
  serviceId?: string;
  order: number;
  createdAt: string;
}

export interface GalleryCategory {
  _id?: string;
  name: string;
  description: string;
  imageCount: number;
  createdAt: string;
}

const IMAGES_COLLECTION = "gallery_images";
const CATEGORIES_COLLECTION = "gallery_categories";
const ALLOWED_IMAGE_FIELDS = [
  "src", "publicId", "category", "caption", "serviceId", "order",
];
const ALLOWED_CATEGORY_FIELDS = ["name", "description"];

function requireAuth(token?: string): void {
  if (!token || !verifyToken(token)) {
    throw new Error("Unauthorized");
  }
}

export const getGalleryImages = createServerFn({ method: "GET" })
  .validator((data?: { category?: string; serviceId?: string }) => data)
  .handler(async ({ data }) => {
    const db = await getDb();
    const filter: Record<string, unknown> = {};
    if (data?.category) filter.category = data.category;
    if (data?.serviceId) filter.serviceId = data.serviceId;

    const images = await db
      .collection(IMAGES_COLLECTION)
      .find(filter)
      .sort({ order: 1 })
      .toArray();

    return images.map((img) => ({
      ...img,
      _id: img._id.toString(),
    })) as GalleryImage[];
  });

export const getGalleryCategories = createServerFn({ method: "GET" })
  .handler(async () => {
    const db = await getDb();
    const categories = await db
      .collection(CATEGORIES_COLLECTION)
      .find()
      .sort({ name: 1 })
      .toArray();

    return categories.map((cat) => ({
      ...cat,
      _id: cat._id.toString(),
    })) as GalleryCategory[];
  });

export const createGalleryCategory = createServerFn({ method: "POST" })
  .validator(
    (data: { token: string; name: string; description: string }) => data,
  )
  .handler(async ({ data }) => {
    requireAuth(data.token);

    const rateCheck = checkRateLimit("create:category");
    if (!rateCheck.allowed) {
      throw new Error("Rate limit exceeded");
    }

    const sanitized = sanitizeObject(
      data as unknown as Record<string, unknown>,
      ALLOWED_CATEGORY_FIELDS,
    );

    const db = await getDb();
    const now = new Date().toISOString();

    const result = await db.collection(CATEGORIES_COLLECTION).insertOne({
      name: sanitized.name,
      description: sanitized.description || "",
      imageCount: 0,
      createdAt: now,
    });

    return {
      _id: result.insertedId.toString(),
      name: sanitized.name as string,
      description: (sanitized.description as string) || "",
      imageCount: 0,
      createdAt: now,
    } as GalleryCategory;
  });

export const deleteGalleryCategory = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: string }) => data)
  .handler(async ({ data }) => {
    requireAuth(data.token);

    const rateCheck = checkRateLimit("delete:category");
    if (!rateCheck.allowed) throw new Error("Rate limit exceeded");

    const db = await getDb();
    await db
      .collection(CATEGORIES_COLLECTION)
      .deleteOne({ _id: new ObjectId(data.id) });
    await db
      .collection(IMAGES_COLLECTION)
      .deleteMany({ category: data.id });

    return { success: true };
  });

export const uploadGalleryImage = createServerFn({ method: "POST" })
  .validator(
    (data: {
      token: string;
      base64: string;
      category: string;
      caption: string;
      serviceId?: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    requireAuth(data.token);

    const rateCheck = checkRateLimit("upload:gallery", {
      windowMs: 60 * 1000,
      maxRequests: 30,
    });
    if (!rateCheck.allowed) throw new Error("Upload rate limit exceeded");

    if (data.base64.length > 10 * 1024 * 1024) {
      throw new Error("File too large. Maximum size is 10MB.");
    }

    const { uploadToCloudinary } = await import("../cloudinary");
    const uploadResult = await uploadToCloudinary(
      data.base64,
      `gallery/${data.category}`,
    );

    const db = await getDb();
    const now = new Date().toISOString();
    const doc: Omit<GalleryImage, "_id"> = {
      src: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      category: data.category,
      caption: data.caption,
      serviceId: data.serviceId,
      order: 0,
      createdAt: now,
    };

    const result = await db.collection(IMAGES_COLLECTION).insertOne(doc);

    await db.collection(CATEGORIES_COLLECTION).updateOne(
      { name: data.category },
      { $inc: { imageCount: 1 } },
      { upsert: true },
    );

    return { ...doc, _id: result.insertedId.toString() } as GalleryImage;
  });

export const deleteGalleryImage = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: string }) => data)
  .handler(async ({ data }) => {
    requireAuth(data.token);

    const rateCheck = checkRateLimit("delete:image");
    if (!rateCheck.allowed) throw new Error("Rate limit exceeded");

    const db = await getDb();
    const image = await db
      .collection(IMAGES_COLLECTION)
      .findOne({ _id: new ObjectId(data.id) });

    if (!image) throw new Error("Image not found");

    if (image.publicId) {
      const { deleteFromCloudinary } = await import("../cloudinary");
      try {
        await deleteFromCloudinary(image.publicId);
      } catch {
        // Proceed even if Cloudinary delete fails
      }
    }

    await db.collection(IMAGES_COLLECTION).deleteOne({ _id: new ObjectId(data.id) });

    await db.collection(CATEGORIES_COLLECTION).updateOne(
      { name: image.category },
      { $inc: { imageCount: -1 } },
    );

    return { success: true };
  });
