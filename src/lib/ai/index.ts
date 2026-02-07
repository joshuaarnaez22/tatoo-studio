import { generateWithGemini } from "./gemini";
import { generateWithOpenAI } from "./openai";

export type GenerationQuality = "draft" | "hd";
export type AIProvider = "gemini" | "openai";

export interface GenerateOptions {
  prompt: string;
  style: string;
  quality: GenerationQuality;
}

export interface GenerateResult {
  imageUrl: string;
  model: string;
  cost: number;
}

export async function generateTattooDesign(
  options: GenerateOptions
): Promise<GenerateResult> {
  const { prompt, style, quality } = options;

  // Use Gemini for draft (free), OpenAI for HD (paid)
  if (quality === "draft") {
    return generateWithGemini({ prompt, style });
  } else {
    return generateWithOpenAI({
      prompt,
      style,
      quality: "high"
    });
  }
}

export { generateWithGemini } from "./gemini";
export { generateWithOpenAI, generateWithDallE3 } from "./openai";
