/**
 * The campaign service layer responsible for generating a
 * complete campaign it starts from generating campaign content
 * by taking user raw prompt as an input, calls groq llm
 * to enhance the raw prompt to a clean optimized ready prompt 
 * as output for HG image generation. Once the image is generated 
 * the image is then uploaded to cloudinary to get URL for the
 * generated image (raw prompt, enhanced prompt, meta data, URL)
 * all this will be saved to DB for that particular user
 * 
 * get all campaign for a user (pagination implemented)
 * 
 * finalized image service business logic is later implemented
 * once user edits the image in UI(frontend part) reuploaded to cloud 
 * for final image url and then saved to DB
 * 
 * delete service (delete campaign by user by campaign_id)
 */
import Campaign from "../models/campaign.model.js";
import { generateCampaignContent } from "./contentGenerator.service.js";
import { generateImage } from "./image.service.js";
import { uploadImageToCloudinary } from "./cloudinary.service.js";

/**
 * Generate Full Campaign (AI + Raw Image Only)
 */
export const generateFullCampaign = async ({
  userId,
  prompt,
  tone,
  platforms
}) => {

  if (!userId) {
    throw new Error("User ID is required to create campaign");
  }

  const campaign = new Campaign({
    userId,
    originalPrompt: prompt,
    tone,
    platforms,
    status: "processing"
  });

  await campaign.save();

  try {
    // Generate AI content
    const aiContent = await generateCampaignContent(
      prompt,
      tone,
      platforms
    );

    // Generate raw AI image
    const imageBuffer = await generateImage(
      aiContent.enhancedPrompt
    );

    // Upload raw image ONLY
    const rawImageUrl = await uploadImageToCloudinary(imageBuffer);

    // Update campaign document
    campaign.enhancedPrompt = aiContent.enhancedPrompt;
    campaign.caption = aiContent.caption;
    campaign.hashtags = aiContent.hashtags || {};
    campaign.rawImageUrl = rawImageUrl;
    campaign.finalImageUrl = null; // Frontend will set this
    campaign.status = "generated";

    await campaign.save();

    return campaign;

  } catch (error) {
    campaign.status = "failed";
    await campaign.save();
    throw error;
  }
};

/**
 * Finalize Campaign Image (Frontend Edited Image Upload)
 */
export const finalizeCampaignImage = async (
  campaignId,
  userId,
  imageBuffer
) => {

  if (!campaignId || !userId) {
    throw new Error("Campaign ID and User ID are required");
  }

  const campaign = await Campaign.findOne({
    _id: campaignId,
    userId
  });

  if (!campaign) {
    throw new Error("Campaign not found or unauthorized");
  }

  // Upload edited image to Cloudinary
  const finalImageUrl = await uploadImageToCloudinary(imageBuffer);

  campaign.finalImageUrl = finalImageUrl;

  await campaign.save();

  return campaign;
};

/**
 * Get campaigns for logged-in user (Pagination Ready)
 */
export const getUserCampaigns = async (
  userId,
  page = 1,
  limit = 10
) => {

  if (!userId) {
    throw new Error("User ID is required");
  }

  const skip = (page - 1) * limit;

  const campaigns = await Campaign.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Campaign.countDocuments({ userId });

  return {
    total,
    page,
    totalPages: Math.ceil(total / limit),
    campaigns
  };
};

export const deleteCampaignById = async (campaignId, userId) => {

  if (!campaignId || !userId) {
    throw new Error("Campaign ID and User ID are required");
  }

  const campaign = await Campaign.findOneAndDelete({
    _id: campaignId,
    userId
  });

  if (!campaign) {
    throw new Error("Campaign not found or unauthorized");
  }

  return campaign;
};