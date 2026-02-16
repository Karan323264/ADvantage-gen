/**
 * Campaign controller responsible for controlling campaigns
 * generating a complete campaign(AI image + Meta Data) 
 * returning all the campaign with respect to user_Id
 * deleting the campaign by campaign_Id
 * the finalize campaign works after user edits the raw image 
 * in the UI and upload it to cloudinary to get the final image URL
 * and that will be updated in the DB for final image section
 */
import * as campaignService from "../services/campaign.service.js";

/**
 * Generate Campaign (Protected by user auth) 
 */
export const generateCampaign = async (req, res) => {
  try {
    const { prompt, tone, platforms } = req.body;

    if (!prompt || !tone || !platforms || !Array.isArray(platforms)) {
      return res.status(400).json({
        message: "prompt, tone, and platforms (array) are required"
      });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await campaignService.generateFullCampaign({
      userId: req.user._id,
      prompt,
      tone,
      platforms
    });

    return res.status(201).json(result);

  } catch (error) {
    console.error("Generate Campaign Error:", error.message);
    return res.status(500).json({
      message: error.message || "Failed to generate campaign"
    });
  }
};

/**
 * Get Logged-in User Campaigns (Safe Pagination Enabled)
 * also protected
 */
export const getMyCampaigns = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Safe pagination
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);

    const result = await campaignService.getUserCampaigns(
      req.user._id,
      page,
      limit
    );

    return res.status(200).json(result);

  } catch (error) {
    console.error("Fetch Campaigns Error:", error.message);
    return res.status(500).json({
      message: error.message || "Failed to fetch campaigns"
    });
  }
};

/**
 * Finalize Campaign (Frontend Edited Image Upload)
 */
export const finalizeCampaign = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Edited image file is required"
      });
    }

    const result = await campaignService.finalizeCampaignImage(
      id,
      req.user._id,
      req.file.buffer
    );

    return res.status(200).json(result);

  } catch (error) {
    console.error("Finalize Campaign Error:", error.message);
    return res.status(500).json({
      message: error.message || "Failed to finalize campaign"
    });
  }
};

/**
 * Delete Campaign (By campaign_Id)
 */
export const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const deleted = await campaignService.deleteCampaignById(
      id,
      req.user._id
    );

    return res.status(200).json({
      message: "Campaign deleted successfully",
      campaignId: deleted._id
    });

  } catch (error) {
    console.error("Delete Campaign Error:", error.message);
    return res.status(500).json({
      message: error.message || "Failed to delete campaign"
    });
  }
};