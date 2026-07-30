import { createServerFn } from "@tanstack/react-start";
import { verifyToken } from "../admin-auth";
import { checkRateLimit } from "../security";

export const uploadImage = createServerFn({ method: "POST" })
  .validator(
    (data: {
      token: string;
      base64: string;
      folder: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    if (!data.token || !verifyToken(data.token)) {
      throw new Error("Unauthorized");
    }

    const rateCheck = checkRateLimit(`upload:${data.folder}`, {
      windowMs: 60 * 1000,
      maxRequests: 20,
    });
    if (!rateCheck.allowed) {
      throw new Error("Upload rate limit exceeded. Try again later.");
    }

    if (data.base64.length > 10 * 1024 * 1024) {
      throw new Error("File too large. Maximum size is 10MB.");
    }

    const { uploadToCloudinary } = await import("../cloudinary");
    const result = await uploadToCloudinary(data.base64, data.folder);

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  });
