import { callGroq } from "./groq.client.js";
import { extractJSON, validateCampaignStructure } from "../utils/jsonValidator.js";

export const generateCampaignContent = async (
  shortPrompt,
  tone,
  platforms = []
) => {

  const systemMessage = {
    role: "system",
    content: `
You are AdVantage Gen AI, a professional AI marketing engine specialized in:

- SDXL / FLUX optimized image prompt engineering
- High-converting social media copy
- Platform-aware hashtag strategy
- Strict structured JSON output

Rules:
- Return ONLY valid JSON
- No markdown
- No explanations
- No extra text
- No commentary outside JSON
`
  };

  const userMessage = {
    role: "user",
    content: `
Short Prompt: "${shortPrompt}"
Caption Tone: "${tone}"
Selected Platforms: ${JSON.stringify(platforms)}

TASKS:

1️⃣ IMAGE PROMPT OPTIMIZATION

Rewrite the short prompt into a highly advanced, SDXL-optimized image generation prompt.

The enhanced prompt MUST include:

- Clear primary subject
- Detailed environment context
- Lighting setup (natural light, golden hour, rim light, softbox, etc.)
- Camera angle and framing (close-up, wide shot, 45-degree, overhead, etc.)
- Lens type (85mm, 35mm, macro, cinematic lens, etc.)
- Depth of field and focus description
- Realistic textures and materials
- Mood and atmosphere
- Color grading direction
- High realism keywords (photorealistic, ultra detailed, high resolution)

Avoid:
- Any mention of text overlays
- Logos
- Watermarks
- Branding elements
- UI elements

The result must be ONE coherent paragraph.
Do not include bullet points.


2️⃣ CAPTION GENERATION

Generate ONE caption aligned strictly to the selected tone.

Tone rules:
- Witty → clever, playful, smart humor
- Professional → confident, polished, authoritative
- Urgent → action-driven, persuasive, compelling
- Inspirational → emotional, uplifting, motivational

Caption must:
- Be platform-neutral
- Not include hashtags
- Not include emojis unless tone requires it


3️⃣ HASHTAGS PER PLATFORM

Generate hashtags separately per platform:

- Instagram → 5 to 8 engaging marketing-friendly hashtags
- LinkedIn → 6 to 7 professional industry hashtags

Rules:
- Each hashtag must start with "#"
- No spaces inside hashtags
- No special characters
- Always return BOTH Instagram and LinkedIn keys
- If a platform is not selected, return an empty array


Return strictly in this JSON format:

{
  "enhancedPrompt": "",
  "caption": "",
  "hashtags": {
    "Instagram": [],
    "LinkedIn": []
  }
}
`
  };

  // First Attempt
  let responseText = await callGroq([systemMessage, userMessage]);
  let parsed = extractJSON(responseText);

  if (validateCampaignStructure(parsed)) {

    // Deterministic backend filtering
    if (!platforms.includes("Instagram")) {
      parsed.hashtags.Instagram = [];
    }

    if (!platforms.includes("LinkedIn")) {
      parsed.hashtags.LinkedIn = [];
    }

    return parsed;
  }

  // Retry Once
  responseText = await callGroq([systemMessage, userMessage]);
  parsed = extractJSON(responseText);

  if (validateCampaignStructure(parsed)) {

    if (!platforms.includes("Instagram")) {
      parsed.hashtags.Instagram = [];
    }

    if (!platforms.includes("LinkedIn")) {
      parsed.hashtags.LinkedIn = [];
    }

    return parsed;
  }

  throw new Error("Groq response validation failed after retry.");
};