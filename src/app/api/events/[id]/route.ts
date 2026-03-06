import { successResponse, withApiHandler } from "@/lib/api-response";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MemberRole, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export const GET = withApiHandler(async (req: Request) => {
	const { searchParams } = new URL(req.url);
	const eventId = searchParams.get("id");

	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		throw new ApiError(ErrorCode.UNAUTHORIZED);
	}

	if (!eventId) {
		throw new ApiError(ErrorCode.MISSING_PARAMETER);
	}

	const events = await prisma.event.findFirst({
		where: {
			id: eventId,
		},
	});

	return successResponse(events);
});
