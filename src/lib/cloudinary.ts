import { v2 as cloudinary } from "cloudinary";

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

function initCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function uploadToCloudinary(
  base64Image: string,
  folder: string,
): Promise<CloudinaryUploadResult> {
  initCloudinary();
  const res = await cloudinary.uploader.upload(base64Image, {
    folder: `prime-modulars/${folder}`,
  });
  
  return {
    public_id: res.public_id,
    secure_url: res.secure_url,
    width: res.width,
    height: res.height,
    format: res.format,
    bytes: res.bytes,
  };
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  initCloudinary();
  await cloudinary.uploader.destroy(publicId);
}
