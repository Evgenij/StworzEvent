import { successResponse, withApiHandler } from "@/lib/api-response";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MemberRole, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export const GET = withApiHandler(async (req: Request) => {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED);

	const { searchParams } = new URL(req.url);
	const sort = searchParams.get("sort") ?? "createdAt";
	const order = (searchParams.get("order") ?? "desc") as "asc" | "desc";

	const organizationId = await prisma.organizationMember.findFirst({
		where: {
			userId: session.user.id,
			memberRole: MemberRole.OWNER,
		},
		select: { organizationId: true },
	});

	const where: Prisma.EventWhereInput = {
		organization: {
			organizationMembers: {
				some: { userId: session.user.id, memberRole: MemberRole.OWNER },
			},
		},
	};

	if (organizationId) {
		where.organizationId = organizationId.organizationId;
	}

	const events = await prisma.event.findMany({
		where,
		orderBy: { [sort]: order },
	});

	return successResponse(events);
});
