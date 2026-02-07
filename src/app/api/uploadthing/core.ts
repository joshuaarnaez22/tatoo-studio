import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user";

const f = createUploadthing();

export const ourFileRouter = {
  bodyImageUploader: f({
    image: { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");
      return { clerkUserId: userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("=== SERVER: onUploadComplete called ===");
      console.log("Metadata:", metadata);
      console.log("File object:", JSON.stringify(file, null, 2));

      // Get URL - try multiple formats
      const url = file.ufsUrl || (file as any).url || (file as any).appUrl;
      console.log("Extracted URL:", url);

      if (!url) {
        console.error("No URL found in file object!");
        // Return whatever we have
        return { url: "", key: file.key, error: "No URL found" };
      }

      // Try to save to database but don't fail the upload if it fails
      let uploadId = null;
      try {
        const user = await getOrCreateUser(metadata.clerkUserId);
        const upload = await prisma.upload.create({
          data: {
            userId: user.id,
            url: url,
            publicId: file.key,
          },
        });
        uploadId = upload.id;
        console.log("Upload saved to database:", uploadId);
      } catch (dbError) {
        console.error("Database error (non-fatal):", dbError);
      }

      const response = {
        url: url,
        uploadId: uploadId,
        key: file.key,
      };
      console.log("Returning response:", response);
      return response;
    }),

  tattooDesignUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 4 },
  })
    .middleware(async () => {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");
      return { clerkUserId: userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Design upload complete for userId:", metadata.clerkUserId);
      const url = file.ufsUrl || file.url;
      return { url: url, key: file.key };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
