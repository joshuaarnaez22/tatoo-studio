import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_AI_API_KEY || "";

if (!apiKey) {
  console.warn("GOOGLE_AI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(apiKey);

export interface GenerateImageOptions {
  prompt: string;
  style: string;
}

export interface GenerateImageResult {
  imageUrl: string;
  model: string;
  cost: number;
}

// Build a detailed prompt for tattoo generation
function buildTattooPrompt(prompt: string, style: string): string {
  const styleDescriptions: Record<string, string> = {
    minimal: "minimalist single-line art, simple clean lines, delicate, subtle",
    tribal: "tribal patterns, bold black geometric shapes, Polynesian or Maori inspired",
    japanese: "traditional Japanese irezumi style, bold outlines, vibrant colors, waves, koi, dragons",
    watercolor: "watercolor effect, soft color splashes, no hard outlines, artistic paint drips",
    blackwork: "solid black ink, intricate patterns, dotwork, heavy saturation",
    geometric: "geometric shapes, sacred geometry, mathematical patterns, symmetrical",
    realism: "photorealistic, detailed shading, lifelike, portrait quality",
    traditional: "American traditional, bold outlines, limited color palette, classic flash art",
  };

  const styleDesc = styleDescriptions[style] || styleDescriptions.minimal;

  return `Create a tattoo design: ${prompt}

Style: ${styleDesc}

Requirements:
- Design should be on a plain white or transparent background
- High contrast suitable for tattoo stencil
- Clean, professional tattoo artwork
- No skin, no body parts, just the isolated design
- Vector-like quality with clear edges`;
}

export async function generateWithGemini(
  options: GenerateImageOptions
): Promise<GenerateImageResult> {
  const { prompt, style } = options;

  if (!apiKey) {
    throw new Error("Google AI API key is not configured");
  }

  // Use Gemini 2.0 Flash for image generation
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-preview-image-generation",
    generationConfig: {
      responseModalities: ["Text", "Image"],
    } as never,
  });

  const tattooPrompt = buildTattooPrompt(prompt, style);

  try {
    const response = await model.generateContent(tattooPrompt);
    const result = response.response;

    // Extract image from response
    const parts = result.candidates?.[0]?.content?.parts || [];

    for (const part of parts) {
      if ('inlineData' in part && part.inlineData) {
        const imageData = part.inlineData.data;
        const mimeType = part.inlineData.mimeType;

        // Return as data URL
        const imageUrl = `data:${mimeType};base64,${imageData}`;

        return {
          imageUrl,
          model: "gemini-2.0-flash",
          cost: 0, // Free tier
        };
      }
    }

    throw new Error("No image generated in response");
  } catch (error) {
    console.error("Gemini generation error:", error);
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        throw new Error("Invalid Google AI API key");
      }
      if (error.message.includes("quota") || error.message.includes("limit")) {
        throw new Error("API quota exceeded. Please try again later.");
      }
      if (error.message.includes("not found") || error.message.includes("404")) {
        throw new Error("AI model not available. Please try HD quality instead.");
      }
    }
    throw new Error("Failed to generate image with Gemini");
  }
}

// Alternative: Use Imagen through Gemini API (if available)
export async function generateWithImagen(
  options: GenerateImageOptions
): Promise<GenerateImageResult> {
  const { prompt, style } = options;
  const tattooPrompt = buildTattooPrompt(prompt, style);

  // Imagen 3 model for higher quality
  const model = genAI.getGenerativeModel({ model: "imagen-3.0-generate-001" });

  try {
    const response = await model.generateContent(tattooPrompt);
    const result = response.response;

    const parts = result.candidates?.[0]?.content?.parts || [];

    for (const part of parts) {
      if ('inlineData' in part && part.inlineData) {
        const imageData = part.inlineData.data;
        const mimeType = part.inlineData.mimeType;
        const imageUrl = `data:${mimeType};base64,${imageData}`;

        return {
          imageUrl,
          model: "imagen-3",
          cost: 0.04, // Approximate cost
        };
      }
    }

    throw new Error("No image generated");
  } catch (error) {
    console.error("Imagen generation error:", error);
    // Fallback to Gemini
    return generateWithGemini(options);
  }
}
