/**
 * campaign model(Entity) responsible to hold the Data
 * according to the data type initialized 
 */
import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    // User Reference
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true  
    },

    // Input Data
    originalPrompt: {
      type: String,
      required: true,
      trim: true
    },

    tone: {
      type: String,
      enum: ["Witty", "Professional", "Urgent", "Inspirational"],
      required: true
    },

    platforms: {
      type: [String],
      enum: ["Instagram", "LinkedIn"],
      required: true
    },

    // AI Enhancement
    enhancedPrompt: {
      type: String,
      default: ""
    },

    // Generated Copy
    caption: {
      type: String,
      default: ""
    },

    hashtags: {
      Instagram: {
        type: [String],
        default: []
      },
      LinkedIn: {
        type: [String],
        default: []
      }
    },

    // Image Data
    rawImageUrl: {
      type: String,
      default: ""
    },

    finalImageUrl: {
      type: String,
      default: ""
    },

    // Remix Feature
    remixOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      default: null
    },

    // Status Tracking
    status: {
      type: String,
      enum: ["processing", "generated", "failed"],
      default: "processing"
    }
  },
  {
    timestamps: true
  }
);

const Campaign = mongoose.model("Campaign", campaignSchema);

export default Campaign;