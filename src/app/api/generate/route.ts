import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { generateTattooDesign, type GenerationQuality } from "@/lib/ai";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { getOrCreateUser } from "@/lib/user";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

const VALID_STYLES = [
  "minimal",
  "tribal",
  "japanese",
  "watercolor",
  "blackwork",
  "geometric",
  "realism",
  "traditional",
];

// Download image and re-upload to permanent storage
async function persistImage(temporaryUrl: string): Promise<string> {
  try {
    console.log("Downloading image from:", temporaryUrl.substring(0, 50) + "...");

    // Fetch the image
    const response = await fetch(temporaryUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const blob = await response.blob();
    const file = new File([blob], `generated-${Date.now()}.png`, {
      type: "image/png",
    });

    console.log("Uploading to permanent storage...");

    // Upload to UploadThing
    const uploadResult = await utapi.uploadFiles([file]);
    if (!uploadResult[0]?.data) {
      console.error("Upload failed:", uploadResult[0]?.error);
      throw new Error("Failed to upload to permanent storage");
    }

    const uploadData = uploadResult[0].data as { ufsUrl?: string; url?: string; appUrl?: string };
    const permanentUrl =
      uploadData.ufsUrl ||
      uploadData.url ||
      uploadData.appUrl;

    console.log("Image persisted to:", permanentUrl);
    return permanentUrl;
  } catch (error) {
    console.error("Failed to persist image:", error);
    // Return original URL as fallback (it will expire eventually)
    return temporaryUrl;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { prompt, style, quality } = body as {
      prompt: string;
      style: string;
      quality: GenerationQuality;
    };

    // Validate input
    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
      return NextResponse.json(
        { error: "Prompt must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (prompt.length > 500) {
      return NextResponse.json(
        { error: "Prompt must be less than 500 characters" },
        { status: 400 }
      );
    }

    if (!style || !VALID_STYLES.includes(style)) {
      return NextResponse.json(
        { error: "Invalid style selected" },
        { status: 400 }
      );
    }

    if (!quality || !["draft", "hd"].includes(quality)) {
      return NextResponse.json(
        { error: "Quality must be 'draft' or 'hd'" },
        { status: 400 }
      );
    }

    // Check rate limit
    const rateLimitKey = `${userId}:${quality}`;
    const rateLimitConfig = quality === "draft" ? RATE_LIMITS.draft : RATE_LIMITS.hd;
    const rateLimitResult = checkRateLimit(rateLimitKey, rateLimitConfig);

    if (!rateLimitResult.success) {
      const resetInMinutes = Math.ceil(
        (rateLimitResult.resetAt - Date.now()) / 60000
      );
      return NextResponse.json(
        {
          error: `Rate limit exceeded. Try again in ${resetInMinutes} minutes.`,
          resetAt: rateLimitResult.resetAt,
          remaining: 0,
        },
        { status: 429 }
      );
    }

    // Get user from database (creates if not synced yet)
    const user = await getOrCreateUser(userId);

    // Generate the tattoo design
    const result = await generateTattooDesign({
      prompt: prompt.trim(),
      style,
      quality,
    });

    // Persist the image to permanent storage (OpenAI URLs expire)
    const permanentImageUrl = await persistImage(result.imageUrl);

    // Save generation to database with permanent URL
    const generation = await prisma.generation.create({
      data: {
        userId: user.id,
        prompt: prompt.trim(),
        imageUrl: permanentImageUrl,
        model: result.model,
        cost: result.cost,
      },
    });

    return NextResponse.json({
      success: true,
      generationId: generation.id,
      imageUrl: permanentImageUrl,
      model: result.model,
      remaining: rateLimitResult.remaining,
    });
  } catch (error) {
    console.error("Generation error:", error);

    // Handle specific errors
    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      if (message.includes("api key") || message.includes("apikey")) {
        return NextResponse.json(
          { error: "AI service is not configured. Please contact support." },
          { status: 500 }
        );
      }
      if (message.includes("content policy") || message.includes("safety")) {
        return NextResponse.json(
          { error: "Your prompt was flagged by content safety filters. Please try a different description." },
          { status: 400 }
        );
      }
      if (message.includes("quota") || message.includes("limit") || message.includes("rate")) {
        return NextResponse.json(
          { error: "AI service is temporarily unavailable. Please try again later." },
          { status: 503 }
        );
      }
      if (message.includes("not found") || message.includes("404") || message.includes("not available")) {
        return NextResponse.json(
          { error: "AI model is temporarily unavailable. Please try HD quality." },
          { status: 503 }
        );
      }

      // Return the actual error message for debugging
      return NextResponse.json(
        { error: error.message || "Failed to generate design. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate design. Please try again." },
      { status: 500 }
    );
  }
}
