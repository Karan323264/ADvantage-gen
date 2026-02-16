/**
 * cloudinary service is used to upload the generated image by HG
 * to cloud only to get the URL for that image and also make sure 
 * that image is stored in the cloud, source URL will be png format
 */
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

let isConfigured = false;

const configureCloudinary = () => {
  if (!isConfigured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    isConfigured = true;
  }
};

export const uploadImageToCloudinary = async (imageBuffer, options = {}) => {

  configureCloudinary(); //configure at runtime

  const {
    folder = "advantage-gen/raw",
    public_id = undefined
  } = options;

  return new Promise((resolve, reject) => {

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id,
        resource_type: "image",
        format: "png"
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          reject(new Error("Cloudinary upload failed"));
        } else {
          resolve(result.secure_url);
        }
      }
    );

    streamifier.createReadStream(imageBuffer).pipe(uploadStream);
  });
};