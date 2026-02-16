/**
 * image service (api call to hugging face image generation model)
 * later this function is called in campaign service for image generation
 */
import axios from "axios";

const HF_MODEL_URL =
  "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0";

export const generateImage = async (
  enhancedPrompt,
  options = {}
) => {

  if (!process.env.HF_API_KEY) {
    throw new Error("HF_API_KEY is not defined.");
  }

  const {
    width = 1024,
    height = 1024,
    guidance_scale = 8,
    num_inference_steps = 40
  } = options;

  try {
    const response = await axios.post(
      HF_MODEL_URL,
      {
        inputs: enhancedPrompt,
        parameters: {
          width,
          height,
          guidance_scale,
          num_inference_steps,
          negative_prompt:
            "low resolution, blurry, distorted, pixelated, watermark, logo, text, bad anatomy, extra fingers, oversaturated, grainy, jpeg artifacts"
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "image/png"
        },
        responseType: "arraybuffer",
        timeout: 90000
      }
    );

    return Buffer.from(response.data);

  } catch (error) {

    if (error.response?.data) {
      const decoded = Buffer.from(error.response.data).toString("utf-8");
      console.error("Hugging Face Error:", decoded);
    } else {
      console.error("Hugging Face Error:", error.message);
    }

    throw new Error("Image generation failed");
  }
};