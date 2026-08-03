import { createServerFn } from "@tanstack/react-start";
import { getDb } from "../db";
import { ObjectId } from "mongodb";
import { checkRateLimit, sanitizeObject, isValidObjectId } from "../security";
import { requireAdmin } from "./guard";

export interface Testimonial {
  _id?: string;
  name: string;
  location: string;
  project: string;
  quote: string;
  rating?: number;
  image?: string;
  imagePublicId?: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

const COLLECTION = "testimonials";
const ALLOWED_FIELDS = [
  "name",
  "location",
  "project",
  "quote",
  "rating",
  "image",
  "imagePublicId",
  "order",
];

function requireAuth(token?: string): void {
  requireAdmin(token);
}

function assertObjectId(id: string): ObjectId {
  if (!isValidObjectId(id)) {
    throw Object.assign(new Error("Invalid id"), { statusCode: 400 });
  }
  return new ObjectId(id);
}

export const getTestimonials = createServerFn({ method: "GET" }).handler(async () => {
  const db = await getDb();
  const testimonials = await db.collection(COLLECTION).find().sort({ order: 1 }).toArray();

  return testimonials.map((t) => ({
    ...t,
    _id: t._id.toString(),
  })) as Testimonial[];
});

export const createTestimonial = createServerFn({ method: "POST" })
  .validator(
    (data: { token: string; testimonial: Omit<Testimonial, "_id" | "createdAt" | "updatedAt"> }) => data,
  )
  .handler(async ({ data }) => {
    requireAuth(data.token);

    const rateCheck = checkRateLimit("create:testimonial");
    if (!rateCheck.allowed) {
      throw new Error("Rate limit exceeded. Try again later.");
    }

    const sanitized = sanitizeObject(
      data.testimonial as unknown as Record<string, unknown>,
      ALLOWED_FIELDS,
    ) as unknown as Omit<Testimonial, "_id" | "createdAt" | "updatedAt">;

    if (!sanitized.name || sanitized.name.length < 2) {
      throw new Error("Name must be at least 2 characters");
    }
    if (!sanitized.quote || sanitized.quote.length < 5) {
      throw new Error("Quote must be at least 5 characters");
    }

    const db = await getDb();
    const now = new Date().toISOString();

    const result = await db.collection(COLLECTION).insertOne({
      ...sanitized,
      rating: sanitized.rating ?? 5,
      order: sanitized.order ?? 0,
      createdAt: now,
      updatedAt: now,
    });

    return {
      ...sanitized,
      _id: result.insertedId.toString(),
      rating: sanitized.rating ?? 5,
      order: sanitized.order ?? 0,
      createdAt: now,
      updatedAt: now,
    } as Testimonial;
  });

export const updateTestimonial = createServerFn({ method: "POST" })
  .validator(
    (data: {
      token: string;
      id: string;
      testimonial: Partial<Omit<Testimonial, "_id" | "createdAt" | "updatedAt">>;
    }) => data,
  )
  .handler(async ({ data }) => {
    requireAuth(data.token);

    const rateCheck = checkRateLimit("update:testimonial");
    if (!rateCheck.allowed) {
      throw new Error("Rate limit exceeded. Try again later.");
    }

    const sanitized = sanitizeObject(
      data.testimonial as unknown as Record<string, unknown>,
      ALLOWED_FIELDS,
    ) as unknown as Partial<Omit<Testimonial, "_id" | "createdAt" | "updatedAt">>;

    const db = await getDb();
    const now = new Date().toISOString();
    const id = assertObjectId(data.id);

    await db
      .collection(COLLECTION)
      .updateOne({ _id: id }, { $set: { ...sanitized, updatedAt: now } });

    const updated = await db.collection(COLLECTION).findOne({ _id: id });

    if (!updated) throw new Error("Testimonial not found after update");

    return { ...updated, _id: updated._id.toString() } as Testimonial;
  });

export const deleteTestimonial = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: string }) => data)
  .handler(async ({ data }) => {
    requireAuth(data.token);

    const rateCheck = checkRateLimit("delete:testimonial");
    if (!rateCheck.allowed) {
      throw new Error("Rate limit exceeded. Try again later.");
    }

    const db = await getDb();
    const result = await db.collection(COLLECTION).deleteOne({ _id: assertObjectId(data.id) });

    if (result.deletedCount === 0) {
      throw new Error("Testimonial not found");
    }

    return { success: true };
  });
