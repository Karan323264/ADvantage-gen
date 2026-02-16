/**
 * this Controller is deprecated 
 * only use it for debug purposes
 * all three (groq test, HF test, cloud upload)
 * services are Separated and tested separately in routes
 * for debug 
 */
import { generateCampaignContent } from "../services/contentGenerator.service.js";
import { generateImage } from "../services/image.service.js";
import { uploadImageToCloudinary } from "../services/cloudinary.service.js";

// GROQ TEST
export const testGroq = async (req, res) => {
  try {
    const { prompt, tone, platforms } = req.body;

    if (!prompt || !tone || !platforms) {
      return res.status(400).json({
        error: "prompt, tone and platforms are required"
      });
    }

    if (!Array.isArray(platforms) || platforms.length === 0) {
      return res.status(400).json({
        error: "platforms must be a non-empty array"
      });
    }

    const result = await generateCampaignContent(prompt, tone, platforms);

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error("Groq Test Error:", error.message);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// IMAGE TEST (HF Only)
export const testImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "prompt is required"
      });
    }

    const imageBuffer = await generateImage(prompt);

    res.set("Content-Type", "image/png");
    return res.send(imageBuffer);

  } catch (error) {
    console.error("Image Test Error:", error.message);

    return res.status(500).json({
      error: error.message
    });
  }
};

// IMAGE + CLOUDINARY TEST
export const testImageUpload = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "prompt is required"
      });
    }

    // Step 1: Generate image
    const imageBuffer = await generateImage(prompt);

    // Step 2: Upload to Cloudinary
    const imageUrl = await uploadImageToCloudinary(imageBuffer);

    return res.status(200).json({
      success: true,
      imageUrl
    });

  } catch (error) {
    console.error("Image Upload Test Error:", error.message);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};