/**
 * upload middleware, once the raw image is edited by the 
 * user the current image becomes the final image to be downloaded
 * and saved in DB require multer to store the image if the image size 
 * is increased
 */
import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});