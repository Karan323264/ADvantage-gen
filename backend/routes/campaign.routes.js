/**
 * Main Routes where it exposes APIs for generating campaign
 * -generate campaign
 * -finalize campaign
 * -get all campaign (pagination Active)
 * -delete campaign (By campaign_Id)
 */
import express from "express";

import {
  generateCampaign,
  getMyCampaigns,
  finalizeCampaign
} from "../controllers/campaign.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { campaignGenerateLimiter } from "../middleware/rateLimit.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { deleteCampaign } from "../controllers/campaign.controller.js";

const router = express.Router();


// Generate campaign (Protected + User Rate Limited)
router.post(
  "/generate",
  protect,
  campaignGenerateLimiter,
  generateCampaign
);


// Get logged-in user's campaigns (Pagination supported)
router.get(
  "/my",
  protect,
  getMyCampaigns
);

// Finalize edited image upload
router.post(
  "/:id/finalize",
  protect,
  upload.single("image"),
  finalizeCampaign
);

router.delete(
  "/:id",
  protect,
  deleteCampaign
);

export default router;