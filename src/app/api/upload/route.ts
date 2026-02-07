import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user";

const utapi = new UTApi();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("Uploading file:", file.name, file.type, file.size);

    // Upload to UploadThing
    const response = await utapi.uploadFiles([file]);
    console.log("UploadThing response:", JSON.stringify(response, null, 2));

    if (!response[0]?.data) {
      console.error("Upload failed:", response[0]?.error);
      return NextResponse.json(
        { error: response[0]?.error?.message || "Upload failed" },
        { status: 500 }
      );
    }

    const uploadedFile = response[0].data;
    const url = uploadedFile.ufsUrl || uploadedFile.url || uploadedFile.appUrl;

    console.log("File uploaded, URL:", url);

    // Save to database
    let uploadId = null;
    try {
      const user = await getOrCreateUser(userId);
      const upload = await prisma.upload.create({
        data: {
          userId: user.id,
          url: url,
          publicId: uploadedFile.key,
        },
      });
      uploadId = upload.id;
      console.log("Saved to database:", uploadId);
    } catch (dbError) {
      console.error("Database error:", dbError);
    }

    return NextResponse.json({
      success: true,
      url: url,
      uploadId: uploadId,
      key: uploadedFile.key,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
