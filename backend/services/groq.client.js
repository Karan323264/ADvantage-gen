/**
 * groq client service (api call to groq llm)
 * this service will be called in content generator service
 */
import axios from "axios";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

export const callGroq = async (messages, temperature = 0.7) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not defined.");
  }

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: MODEL,
        messages,
        temperature
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 15000
      }
    );

    return response.data.choices[0].message.content.trim();

  } catch (error) {
    console.error("Groq API Error:", error.response?.data || error.message);
    throw new Error("Groq API call failed");
  }
};