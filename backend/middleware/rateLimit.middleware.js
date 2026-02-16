/**
 * rate limiting middleware is securely implemented 
 * for a successful logged in user gets 1 hour window to use
 * the product and 20 requests for to generate the campaign
 */
import rateLimit, { ipKeyGenerator } from "express-rate-limit";

// User-based Campaign Generation Limit
export const campaignGenerateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,

  keyGenerator: (req) => {
    if (req.user && req.user._id) {
      return req.user._id.toString();
    }

    // Proper IPv6-safe fallback
    return ipKeyGenerator(req);
  },

  message: {
    message: "You have reached your hourly campaign generation limit. Try again later."
  },

  standardHeaders: true,
  legacyHeaders: false
});