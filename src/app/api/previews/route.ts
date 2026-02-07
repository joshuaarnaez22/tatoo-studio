import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getOrCreateUser(userId);

    // Get all uploads for this user with their previews
    const uploads = await prisma.upload.findMany({
      where: { userId: user.id },
      include: {
        previews: {
          include: {
            design: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Flatten to get all previews
    const previews = uploads.flatMap((upload) =>
      upload.previews.map((preview) => ({
        id: preview.id,
        resultUrl: preview.resultUrl,
        position: preview.position,
        createdAt: preview.createdAt,
        bodyImage: upload.url,
        design: preview.design,
      }))
    );

    return NextResponse.json({ previews });
  } catch (error) {
    console.error("Failed to fetch previews:", error);
    return NextResponse.json(
      { error: "Failed to fetch previews" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getOrCreateUser(userId);
    const body = await request.json();
    const { uploadId, designId, designImageUrl, designName, position, imageDataUrl } = body;

    console.log("Preview save request:", { uploadId, designId, designName, hasImageData: !!imageDataUrl });

    if (!imageDataUrl) {
      return NextResponse.json(
        { error: "Missing required field: imageDataUrl" },
        { status: 400 }
      );
    }

    // Convert base64 data URL to a file and upload it
    const base64Data = imageDataUrl.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const file = new File([buffer], `preview-${Date.now()}.png`, {
      type: "image/png",
    });

    // Upload to UploadThing
    console.log("Uploading preview image...");
    const uploadResult = await utapi.uploadFiles([file]);
    if (!uploadResult[0]?.data) {
      console.error("Upload failed:", uploadResult[0]?.error);
      return NextResponse.json(
        { error: "Failed to upload preview image" },
        { status: 500 }
      );
    }

    const resultUrl =
      uploadResult[0].data.ufsUrl ||
      uploadResult[0].data.url ||
      (uploadResult[0].data as any).appUrl;

    console.log("Preview image uploaded:", resultUrl);

    // Handle the upload - create one if we don't have an uploadId
    let finalUploadId = uploadId;
    if (!finalUploadId) {
      // Create an upload record for tracking
      const newUpload = await prisma.upload.create({
        data: {
          userId: user.id,
          url: "preview-placeholder", // This is a preview without a body image upload
        },
      });
      finalUploadId = newUpload.id;
      console.log("Created placeholder upload:", finalUploadId);
    }

    // Handle the design - find or create
    let finalDesignId = designId;

    // Check if designId refers to a TattooDesign
    let existingDesign = await prisma.tattooDesign.findUnique({
      where: { id: designId },
    });

    if (!existingDesign) {
      // Check if it's a Generation
      const generation = await prisma.generation.findUnique({
        where: { id: designId },
      });

      if (generation) {
        // Create a TattooDesign from the Generation
        console.log("Creating TattooDesign from Generation...");
        existingDesign = await prisma.tattooDesign.create({
          data: {
            userId: user.id,
            name: generation.prompt.slice(0, 50) + (generation.prompt.length > 50 ? "..." : ""),
            description: generation.prompt,
            imageUrl: generation.imageUrl,
            category: "generated",
            tags: ["ai-generated"],
            isPublic: false,
          },
        });
        finalDesignId = existingDesign.id;
        console.log("Created TattooDesign:", finalDesignId);
      } else if (designImageUrl && designName) {
        // Create a new TattooDesign for external designs
        console.log("Creating TattooDesign from external source...");
        existingDesign = await prisma.tattooDesign.create({
          data: {
            userId: user.id,
            name: designName,
            imageUrl: designImageUrl,
            category: "custom",
            tags: [],
            isPublic: false,
          },
        });
        finalDesignId = existingDesign.id;
        console.log("Created TattooDesign:", finalDesignId);
      } else {
        return NextResponse.json(
          { error: "Design not found and cannot create one without designImageUrl" },
          { status: 400 }
        );
      }
    }

    // Save preview to database
    console.log("Saving preview to database...", { finalUploadId, finalDesignId });
    const preview = await prisma.tattooPreview.create({
      data: {
        uploadId: finalUploadId,
        designId: finalDesignId,
        resultUrl,
        position: position || null,
      },
      include: {
        design: true,
        upload: true,
      },
    });

    console.log("Preview saved successfully:", preview.id);

    return NextResponse.json({
      success: true,
      preview: {
        id: preview.id,
        resultUrl: preview.resultUrl,
        position: preview.position,
        createdAt: preview.createdAt,
        bodyImage: preview.upload.url,
        design: preview.design,
      },
    });
  } catch (error) {
    console.error("Failed to save preview:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save preview" },
      { status: 500 }
    );
  }
}
