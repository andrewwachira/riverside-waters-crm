import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/auth"; 

const f = createUploadthing();

export const allFilesRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({ image: { maxFileSize: "4MB" },pdf:{maxFileSize:"4MB"} })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      const session = await auth();
      if (!session?.user) throw new UploadThingError("Unauthorized");
      return { userId: session?.user?.name };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, fileUrl : file.url};
    }),
};