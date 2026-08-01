import { createServerFn } from "@tanstack/react-start";
import { getDb } from "../db";
import { ObjectId } from "mongodb";
import {
  checkRateLimit,
  sanitizeObject,
  sanitizeString,
  isValidObjectId,
  base64ByteLength,
} from "../security";
import { requireAdmin } from "./guard";

export interface GalleryImage {
  _id?: string;
  type: "image" | "video";
  src: string;
  publicId: string;
  beforeSrc?: string;
  beforePublicId?: string;
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
  "type",
  "src",
  "publicId",
  "beforeSrc",
  "beforePublicId",
  "category",
  "caption",
  "serviceId",
  "order",
];
const ALLOWED_CATEGORY_FIELDS = ["name", "description"];

function requireAuth(token?: string): void {
  requireAdmin(token);
}

function assertObjectId(id: string): ObjectId {
  if (!isValidObjectId(id)) {
    throw Object.assign(new Error("Invalid id"), { statusCode: 400 });
  }
  return new ObjectId(id);
}

function assertCategoryName(name: string): string {
  const clean = sanitizeString(name).slice(0, 60);
  if (!clean) {
    throw Object.assign(new Error("Category is required"), { statusCode: 400 });
  }
  return clean;
}

function assertCaption(caption: string): string {
  return sanitizeString(caption).slice(0, 500);
}

export const getGalleryImages = createServerFn({ method: "GET" })
  .validator((data?: { category?: string; serviceId?: string }) => data)
  .handler(async ({ data }) => {
    const db = await getDb();
    const filter: Record<string, unknown> = {};
    if (data?.category) filter.category = data.category;
    if (data?.serviceId) filter.serviceId = data.serviceId;

    const images = await db.collection(IMAGES_COLLECTION).find(filter).sort({ order: 1 }).toArray();

    return images.map((img) => ({
      ...img,
      _id: img._id.toString(),
    })) as GalleryImage[];
  });

export const getGalleryCategories = createServerFn({ method: "GET" }).handler(async () => {
  const db = await getDb();
  const categories = await db.collection(CATEGORIES_COLLECTION).find().sort({ name: 1 }).toArray();

  return categories.map((cat) => ({
    ...cat,
    _id: cat._id.toString(),
  })) as GalleryCategory[];
});

export const createGalleryCategory = createServerFn({ method: "POST" })
  .validator((data: { token: string; name: string; description: string }) => data)
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
    const id = assertObjectId(data.id);
    const category = await db.collection(CATEGORIES_COLLECTION).findOne({ _id: id });
    if (!category) throw new Error("Category not found");

    const images = await db
      .collection(IMAGES_COLLECTION)
      .find({ category: category.name })
      .toArray();

    const { deleteFromCloudinary } = await import("../cloudinary");
    for (const img of images) {
      try {
        if (img.publicId) await deleteFromCloudinary(img.publicId);
        if (img.beforePublicId) await deleteFromCloudinary(img.beforePublicId);
      } catch {
        // Proceed even if Cloudinary delete fails
      }
    }

    await db.collection(IMAGES_COLLECTION).deleteMany({ category: category.name });
    await db.collection(CATEGORIES_COLLECTION).deleteOne({ _id: id });

    return { success: true };
  });

export const uploadGalleryImage = createServerFn({ method: "POST" })
  .validator(
    (data: {
      token: string;
      type?: "image" | "video";
      base64: string;
      beforeBase64?: string;
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

    const type = data.type === "video" ? "video" : "image";
    const category = assertCategoryName(data.category);
    const caption = assertCaption(data.caption ?? "");
    const serviceId =
      data.serviceId && isValidObjectId(data.serviceId) ? data.serviceId : undefined;

    const maxBytes = type === "video" ? 150 * 1024 * 1024 : 10 * 1024 * 1024;
    if (!data.base64 || base64ByteLength(data.base64) > maxBytes) {
      throw new Error(
        type === "video"
          ? "Video too large. Maximum size is 150MB."
          : "File too large. Maximum size is 10MB.",
      );
    }
    if (data.beforeBase64 && base64ByteLength(data.beforeBase64) > 10 * 1024 * 1024) {
      throw new Error("Before image too large. Maximum size is 10MB.");
    }

    const { uploadToCloudinary } = await import("../cloudinary");
    const uploadResult = await uploadToCloudinary(
      data.base64,
      `gallery/${category}/${type === "video" ? "videos" : "images"}`,
      { resourceType: type },
    );

    let beforeUploadResult = null;
    if (type === "image" && data.beforeBase64) {
      beforeUploadResult = await uploadToCloudinary(
        data.beforeBase64,
        `gallery/${category}/before`,
      );
    }

    const db = await getDb();
    const now = new Date().toISOString();
    const doc: Omit<GalleryImage, "_id"> = {
      type,
      src: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      beforeSrc: beforeUploadResult?.secure_url,
      beforePublicId: beforeUploadResult?.public_id,
      category,
      caption,
      serviceId,
      order: 0,
      createdAt: now,
    };

    const result = await db.collection(IMAGES_COLLECTION).insertOne(doc);

    await db
      .collection(CATEGORIES_COLLECTION)
      .updateOne({ name: category }, { $inc: { imageCount: 1 } }, { upsert: true });

    return { ...doc, _id: result.insertedId.toString() } as GalleryImage;
  });

export const getGalleryUploadConfig = createServerFn({ method: "POST" })
  .validator((data: { token: string; type: "image" | "video"; category: string }) => data)
  .handler(async ({ data }) => {
    requireAuth(data.token);

    const rateCheck = checkRateLimit("upload:config", {
      windowMs: 60 * 1000,
      maxRequests: 60,
    });
    if (!rateCheck.allowed) throw new Error("Rate limit exceeded");

    const { v2: cloudinary } = await import("cloudinary");
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const category = assertCategoryName(data.category);
    const resourceType = data.type === "video" ? "video" : "image";
    const timestamp = Math.round(Date.now() / 1000);
    const folder = `prime-modulars/gallery/${category}/${
      resourceType === "video" ? "videos" : "images"
    }`;
    const paramsToSign = { timestamp, folder };
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET ?? "",
    );

    return {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
      apiKey: process.env.CLOUDINARY_API_KEY ?? "",
      signature,
      timestamp: String(timestamp),
      folder,
      resourceType,
    };
  });

export const saveGalleryVideo = createServerFn({ method: "POST" })
  .validator(
    (data: {
      token: string;
      publicId: string;
      secureUrl: string;
      category: string;
      caption: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    requireAuth(data.token);

    const rateCheck = checkRateLimit("save:video", {
      windowMs: 60 * 1000,
      maxRequests: 30,
    });
    if (!rateCheck.allowed) throw new Error("Rate limit exceeded");

    const db = await getDb();
    const now = new Date().toISOString();

    const category = assertCategoryName(data.category);
    const caption = assertCaption(data.caption ?? "");
    const publicId = sanitizeString(data.publicId).replace(/[^a-zA-Z0-9/_-]/g, "");
    const secureUrl = data.secureUrl.startsWith("https://") ? data.secureUrl.slice(0, 500) : "";
    if (!publicId || !secureUrl) {
      throw Object.assign(new Error("Invalid media reference"), { statusCode: 400 });
    }

    const doc: Omit<GalleryImage, "_id"> = {
      type: "video",
      src: secureUrl,
      publicId,
      category,
      caption,
      order: 0,
      createdAt: now,
    };

    const result = await db.collection(IMAGES_COLLECTION).insertOne(doc);

    await db
      .collection(CATEGORIES_COLLECTION)
      .updateOne({ name: category }, { $inc: { imageCount: 1 } }, { upsert: true });

    return { ...doc, _id: result.insertedId.toString() } as GalleryImage;
  });

export const deleteGalleryImage = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: string }) => data)
  .handler(async ({ data }) => {
    requireAuth(data.token);

    const rateCheck = checkRateLimit("delete:image");
    if (!rateCheck.allowed) throw new Error("Rate limit exceeded");

    const db = await getDb();
    const image = await db.collection(IMAGES_COLLECTION).findOne({ _id: assertObjectId(data.id) });

    if (!image) throw new Error("Image not found");

    if (image.publicId) {
      const { deleteFromCloudinary } = await import("../cloudinary");
      try {
        await deleteFromCloudinary(image.publicId);
        if (image.beforePublicId) {
          await deleteFromCloudinary(image.beforePublicId);
        }
      } catch {
        // Proceed even if Cloudinary delete fails
      }
    }

    await db.collection(IMAGES_COLLECTION).deleteOne({ _id: new ObjectId(data.id) });

    await db
      .collection(CATEGORIES_COLLECTION)
      .updateOne({ name: image.category }, { $inc: { imageCount: -1 } });

    return { success: true };
  });
