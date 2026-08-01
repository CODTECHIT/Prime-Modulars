import { createServerFn } from "@tanstack/react-start";
import { checkRateLimit, base64ByteLength, sanitizeString } from "../security";
import { requireAdmin } from "./guard";

const ALLOWED_FOLDERS = new Set(["services", "gallery"]);
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export const uploadImage = createServerFn({ method: "POST" })
  .validator((data: { token: string; base64: string; folder: string }) => data)
  .handler(async ({ data }) => {
    requireAdmin(data.token);

    const folder = sanitizeString(data.folder).slice(0, 50);
    if (!ALLOWED_FOLDERS.has(folder)) {
      throw Object.assign(new Error("Invalid upload folder"), { statusCode: 400 });
    }

    const rateCheck = checkRateLimit(`upload:${folder}`, {
      windowMs: 60 * 1000,
      maxRequests: 20,
    });
    if (!rateCheck.allowed) {
      throw new Error("Upload rate limit exceeded. Try again later.");
    }

    if (!data.base64 || base64ByteLength(data.base64) > MAX_IMAGE_BYTES) {
      throw new Error("File too large. Maximum size is 10MB.");
    }

    const { uploadToCloudinary } = await import("../cloudinary");
    const result = await uploadToCloudinary(data.base64, folder);

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  });
