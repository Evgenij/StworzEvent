import { successResponse, withApiHandler } from "@/lib/api-response";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export const GET = withApiHandler(async (req: Request) => {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED);

	const ALLOWED_SORT_FIELDS = [
		"createdAt",
		"startsAt",
		"title",
		"status",
	] as const;
	type SortField = (typeof ALLOWED_SORT_FIELDS)[number];

	const { searchParams } = new URL(req.url);
	const sortParam = searchParams.get("sort") ?? "createdAt";
	const sort: SortField = (ALLOWED_SORT_FIELDS as readonly string[]).includes(
		sortParam,
	)
		? (sortParam as SortField)
		: "createdAt";
	const order = searchParams.get("order") === "asc" ? "asc" : "desc";

	const organizationId = searchParams.get("organizationId");

	const memberOrg = await prisma.organizationMember.findFirst({
		where: { userId: session.user.id, organizationId: organizationId ?? undefined },
		select: { organizationId: true },
	});

	if (!memberOrg) throw new ApiError(ErrorCode.FORBIDDEN);

	const where: Prisma.EventWhereInput = {
		organizationId: memberOrg.organizationId,
	};

	const events = await prisma.event.findMany({
		where,
		orderBy: { [sort]: order },
		include: {
			categories: {
				include: {
					category: {
						select: {
							id: true,
							name: true,
							slug: true,
							icon: true,
						},
					},
				},
			},
		},
	});

	return successResponse(events);
});
