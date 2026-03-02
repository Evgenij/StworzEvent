import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ErrorCode } from "@/types/error-code";
import { successResponse, withApiHandler } from "@/lib/api-response";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { ApiError } from "@/error/api-error";

export async function GET1() {
	try {
		const invites = await prisma.invitation.findMany({
			orderBy: { createdAt: "desc" },
		});

		return NextResponse.json(invites);
	} catch (error) {
		console.error(error);

		return NextResponse.json(
			{ code: ErrorCode.FETCH_FAILED },
			{ status: 500 },
		);
	}
}

export const GET = withApiHandler(async (req: Request) => {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		throw new ApiError(ErrorCode.UNAUTHORIZED);
	}

	const invites = await prisma.invitation.findMany({
		orderBy: { createdAt: "desc" },
	});

	return successResponse(invites);
});
