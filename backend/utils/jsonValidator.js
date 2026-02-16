/** 
 * A utility function used to validate the extracted 
 * json format from llm response
 * Validates the structure of the campaign JSON returned by the LLM
 * Validation Rules:
 * - enhancedPrompt must be a string
 * - caption must be a string
 * - hashtags must be an object
 * - Instagram & LinkedIn keys must exist
 * - Each must be an array
 * - Each hashtag must:
 * - Be a string
 * - Start with "#"
*/
export const extractJSON = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
};

export const validateCampaignStructure = (data) => {
  if (!data) return false;

  // Basic fields
  if (typeof data.enhancedPrompt !== "string") return false;
  if (typeof data.caption !== "string") return false;

  // Hashtags must be object
  if (typeof data.hashtags !== "object" || data.hashtags === null)
    return false;

  const { Instagram, LinkedIn } = data.hashtags;

  // Both keys must exist and be arrays
  if (!Array.isArray(Instagram)) return false;
  if (!Array.isArray(LinkedIn)) return false;

  // Validate Instagram hashtags
  for (const tag of Instagram) {
    if (typeof tag !== "string") return false;
    if (!tag.startsWith("#")) return false;
  }

  // Validate LinkedIn hashtags
  for (const tag of LinkedIn) {
    if (typeof tag !== "string") return false;
    if (!tag.startsWith("#")) return false;
  }

  return true;
};