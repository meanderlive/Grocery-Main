import { v2 as cloudinary } from "cloudinary";

export const connectCloudinary = async () => {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    if (!cloudName || !apiKey || !apiSecret) {
      console.log("⚠️  Cloudinary credentials not found in environment variables");
      console.log("💡 Create a .env file with CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET");
      console.log("🔄 Continuing without Cloudinary...");
      return;
    }
    
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
    
    console.log("✅ Cloudinary connected successfully");
  } catch (error) {
    console.error("❌ Error connecting to Cloudinary:", error.message);
    console.log("🔄 Continuing without Cloudinary...");
  }
};
