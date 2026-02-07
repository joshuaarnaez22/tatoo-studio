import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.warn("OPENAI_API_KEY is not set");
}

const openai = new OpenAI({
  apiKey: apiKey || "missing-key",
});

export interface GenerateImageOptions {
  prompt: string;
  style: string;
  quality?: "low" | "medium" | "high";
}

export interface GenerateImageResult {
  imageUrl: string;
  model: string;
  cost: number;
}

// Build a detailed prompt for tattoo generation
function buildTattooPrompt(prompt: string, style: string): string {
  const styleDescriptions: Record<string, string> = {
    minimal: "minimalist single-line art, simple clean lines, delicate, subtle, fine linework",
    tribal: "tribal patterns, bold black geometric shapes, Polynesian or Maori inspired, strong contrast",
    japanese: "traditional Japanese irezumi style, bold outlines, waves, koi fish, dragons, cherry blossoms",
    watercolor: "watercolor effect, soft color splashes and bleeds, no hard outlines, artistic paint drips",
    blackwork: "solid black ink, intricate patterns, dotwork, heavy saturation, mandala elements",
    geometric: "geometric shapes, sacred geometry, mathematical patterns, perfectly symmetrical",
    realism: "photorealistic, detailed shading, lifelike, portrait quality, high detail",
    traditional: "American traditional, bold black outlines, limited color palette, classic flash art style",
  };

  const styleDesc = styleDescriptions[style] || styleDescriptions.minimal;

  return `Create a professional tattoo design: ${prompt}

Art style: ${styleDesc}

Important requirements:
- Plain white background, isolated design only
- High contrast black ink artwork suitable for tattooing
- Clean professional tattoo flash sheet quality
- No skin, no body parts shown, just the isolated tattoo design
- Sharp clean edges, vector-like quality
- Suitable for use as a tattoo stencil`;
}

// Pricing per image (approximate)
const PRICING = {
  "gpt-image-1": {
    low: 0.011,
    medium: 0.042,
    high: 0.167,
  },
  "dall-e-3": {
    standard: 0.04,
    hd: 0.08,
  },
};

export async function generateWithOpenAI(
  options: GenerateImageOptions
): Promise<GenerateImageResult> {
  const { prompt, style, quality = "medium" } = options;

  if (!apiKey) {
    throw new Error("OpenAI API key is not configured");
  }

  const tattooPrompt = buildTattooPrompt(prompt, style);

  try {
    // Use GPT Image 1 (gpt-image-1) for best quality/cost ratio
    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: tattooPrompt,
      n: 1,
      size: "1024x1024",
      quality: quality === "high" ? "hd" : "standard",
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error("No image URL in response");
    }

    return {
      imageUrl,
      model: "gpt-image-1",
      cost: PRICING["gpt-image-1"][quality],
    };
  } catch (error) {
    // Fallback to DALL-E 3 if GPT Image 1 fails
    console.error("GPT Image 1 error, falling back to DALL-E 3:", error);
    return generateWithDallE3(options);
  }
}

export async function generateWithDallE3(
  options: GenerateImageOptions
): Promise<GenerateImageResult> {
  const { prompt, style, quality = "medium" } = options;

  if (!apiKey) {
    throw new Error("OpenAI API key is not configured");
  }

  const tattooPrompt = buildTattooPrompt(prompt, style);

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: tattooPrompt,
    n: 1,
    size: "1024x1024",
    quality: quality === "high" ? "hd" : "standard",
  });

  const imageUrl = response.data?.[0]?.url;
  if (!imageUrl) {
    throw new Error("No image URL in response");
  }

  const cost = quality === "high"
    ? PRICING["dall-e-3"].hd
    : PRICING["dall-e-3"].standard;

  return {
    imageUrl,
    model: "dall-e-3",
    cost,
  };
}
