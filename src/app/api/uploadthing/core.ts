import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";

const f = createUploadthing();

export const ourFileRouter = {
	eventCover: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
		.middleware(async () => {
			const session = await auth.api.getSession({
				headers: await headers(),
			});
			if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);
			return { userId: session.user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			return { url: file.url };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
