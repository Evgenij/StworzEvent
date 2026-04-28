import prisma from "@/lib/prisma";
import { ErrorCode } from "@/types/error-code";
import { successResponse, withApiHandler } from "@/lib/api-response";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { ApiError } from "@/error/api-error";


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
