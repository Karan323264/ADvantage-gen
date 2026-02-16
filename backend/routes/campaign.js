/**
 * This route is deprecated only use for debug purposes
 * testing all there services(groq llm, image model, cloudinary upload)
 * individually for optimal outcomes
 */
import express from 'express';
import { testGroq , testImage, testImageUpload} from '../controllers/campaign.controller.js';

const router = express.Router();

router.post('/test-groq', testGroq);
router.post('/test-image', testImage);
router.post('/test-upload', testImageUpload);

export default router;   