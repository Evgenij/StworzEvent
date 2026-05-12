"use server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function deleteUploadAction(fileUrl: string) {
	const fileKey = fileUrl.split("/").at(-1);
	if (!fileKey) return;
	await utapi.deleteFiles(fileKey);
}
