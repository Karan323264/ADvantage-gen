/**
 * AdVantage Gen - Main Express Application
 * - Loads environment variables
 * - Configures global middleware
 * - Applies global rate limiting
 * - Registers API routes
 * - Handles 404 routes
 */
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import campaignRoutes from "./routes/campaign.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// GLOBAL IP RATE LIMIT (Basic Protection)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP per window
  message: {
    message: "Too many requests. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply global limiter BEFORE routes
app.use(globalLimiter);

// Health Check Route
app.get("/", (req, res) => {
  res.send("AdVantage Gen API Running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/campaign", campaignRoutes);


// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;