import { createServerFn } from "@tanstack/react-start";
import { getDb } from "../db";
import { ObjectId } from "mongodb";
import { verifyToken } from "../admin-auth";
import { checkRateLimit, sanitizeString, sanitizeObject } from "../security";

export interface Service {
  _id?: string;
  title: string;
  description: string;
  iconName: string;
  mainImage: string;
  mainImagePublicId: string;
  portfolioCategory: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const COLLECTION = "services";
const ALLOWED_FIELDS = [
  "title", "description", "iconName", "mainImage",
  "mainImagePublicId", "portfolioCategory", "order",
];

function requireAuth(token?: string): void {
  if (!token || !verifyToken(token)) {
    throw new Error("Unauthorized");
  }
}

export const getServices = createServerFn({ method: "GET" })
  .handler(async () => {
    const db = await getDb();
    const services = await db
      .collection(COLLECTION)
      .find()
      .sort({ order: 1 })
      .toArray();

    return services.map((s) => ({
      ...s,
      _id: s._id.toString(),
    })) as Service[];
  });

export const createService = createServerFn({ method: "POST" })
  .validator(
    (data: {
      token: string;
      service: Omit<Service, "_id" | "createdAt" | "updatedAt">;
    }) => data,
  )
  .handler(async ({ data }) => {
    requireAuth(data.token);

    const rateCheck = checkRateLimit("create:service");
    if (!rateCheck.allowed) {
      throw new Error("Rate limit exceeded. Try again later.");
    }

    const sanitized = sanitizeObject(
      data.service as unknown as Record<string, unknown>,
      ALLOWED_FIELDS,
    ) as unknown as Omit<Service, "_id" | "createdAt" | "updatedAt">;

    if (!sanitized.title || sanitized.title.length < 2) {
      throw new Error("Title must be at least 2 characters");
    }

    const db = await getDb();
    const now = new Date().toISOString();

    const result = await db.collection(COLLECTION).insertOne({
      ...sanitized,
      createdAt: now,
      updatedAt: now,
    });

    return {
      ...sanitized,
      _id: result.insertedId.toString(),
      createdAt: now,
      updatedAt: now,
    } as Service;
  });

export const updateService = createServerFn({ method: "POST" })
  .validator(
    (data: {
      token: string;
      id: string;
      service: Partial<Omit<Service, "_id" | "createdAt" | "updatedAt">>;
    }) => data,
  )
  .handler(async ({ data }) => {
    requireAuth(data.token);

    const rateCheck = checkRateLimit("update:service");
    if (!rateCheck.allowed) {
      throw new Error("Rate limit exceeded. Try again later.");
    }

    const sanitized = sanitizeObject(
      data.service as unknown as Record<string, unknown>,
      ALLOWED_FIELDS,
    ) as unknown as Partial<Omit<Service, "_id" | "createdAt" | "updatedAt">>;

    const db = await getDb();
    const now = new Date().toISOString();

    await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(data.id) },
      { $set: { ...sanitized, updatedAt: now } },
    );

    const updated = await db
      .collection(COLLECTION)
      .findOne({ _id: new ObjectId(data.id) });

    if (!updated) throw new Error("Service not found after update");

    return { ...updated, _id: updated._id.toString() } as Service;
  });

export const deleteService = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: string }) => data)
  .handler(async ({ data }) => {
    requireAuth(data.token);

    const rateCheck = checkRateLimit("delete:service");
    if (!rateCheck.allowed) {
      throw new Error("Rate limit exceeded. Try again later.");
    }

    const db = await getDb();
    const result = await db
      .collection(COLLECTION)
      .deleteOne({ _id: new ObjectId(data.id) });

    if (result.deletedCount === 0) {
      throw new Error("Service not found");
    }

    return { success: true };
  });
