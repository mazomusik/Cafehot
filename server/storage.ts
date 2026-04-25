import { v2 as cloudinary } from "cloudinary";

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "djoidvotq",
  api_key: process.env.CLOUDINARY_API_KEY || "585845816675449",
  api_secret: process.env.CLOUDINARY_API_SECRET || "w-pw-8keXt-y-FIosiYRCGrXb4c",
});

export async function storagePut(
  base64Data: string,
  folder: string = "modelo-app"
): Promise<{ key: string; url: string }> {
  try {
    // Cloudinary acepta base64 con el prefijo data:image/...
    const uploadResponse = await cloudinary.uploader.upload(base64Data, {
      folder: folder,
      resource_type: "auto",
    });

    return {
      key: uploadResponse.public_id,
      url: uploadResponse.secure_url,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload image to cloud storage");
  }
}

export async function storageDelete(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
  }
}
