import { successResponse, withApiHandler } from "@/lib/api-response";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { EventStatus, Prisma } from "@prisma/client";
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

	const search = searchParams.get("search") ?? "";
	const statusValues = searchParams.getAll("status") as EventStatus[];
	const from = searchParams.get("from");
	const to = searchParams.get("to");

	// Парсим как локальную дату (без UTC-смещения) и берём конец дня для to
	const parseLocalDate = (dateStr: string) => {
		const [y, m, d] = dateStr.split("-").map(Number);
		return new Date(y, m - 1, d);
	};
	const fromDate = from ? parseLocalDate(from) : undefined;
	const toDate = to ? parseLocalDate(to) : undefined;
	if (toDate) toDate.setHours(23, 59, 59, 999);

	const where: Prisma.EventWhereInput = {
		organizationId: memberOrg.organizationId,
		...(search && { title: { contains: search, mode: "insensitive" } }),
		...(statusValues.length > 0 && { status: { in: statusValues } }),
		...((fromDate || toDate) && {
			startsAt: {
				...(fromDate && { gte: fromDate }),
				...(toDate && { lte: toDate }),
			},
		}),
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
			tickets: {
				select: {
					name: true,
					quantity: true,
					orderItems: {
						where: {
							orders: {
								status: { in: ["CONFIRMED", "PAID"] },
								deletedAt: null,
							},
						},
						select: { quantity: true },
					},
				},
			},
		},
	});

	return successResponse(events);
});
