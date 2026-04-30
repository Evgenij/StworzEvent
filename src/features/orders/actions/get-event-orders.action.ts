"use server";

import { ApiError } from "@/error/api-error";
import prisma from "@/lib/prisma";
import { ErrorCode } from "@/types/error-code";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { OrderStatus, Prisma } from "@prisma/client";
import type { OrganizerOrdersResult } from "@/features/orders/types/organizer-order";

type GetEventOrdersInput = {
	eventId: string;
	query?: string;
	status?: OrderStatus | "ALL";
};

const activeRevenueStatuses: OrderStatus[] = [
	OrderStatus.CONFIRMED,
	OrderStatus.PAID,
];

export async function getEventOrdersAction({
	eventId,
	query,
	status = "ALL",
}: GetEventOrdersInput): Promise<OrganizerOrdersResult> {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);

	const event = await prisma.event.findFirst({
		where: {
			id: eventId,
			organization: {
				organizationMembers: {
					some: { userId: session.user.id },
				},
			},
		},
		select: { id: true, title: true },
	});

	if (!event) throw new ApiError(ErrorCode.FORBIDDEN, 403);

	const trimmedQuery = query?.trim();
	const orderWhere: Prisma.OrderWhereInput = {
		eventId,
		...(status !== "ALL" ? { status } : {}),
		...(trimmedQuery
			? {
					OR: [
						{
							orderNumber: {
								contains: trimmedQuery,
								mode: "insensitive",
							},
						},
						{
							email: {
								contains: trimmedQuery,
								mode: "insensitive",
							},
						},
						{
							buyerName: {
								contains: trimmedQuery,
								mode: "insensitive",
							},
						},
						{
							buyerSurname: {
								contains: trimmedQuery,
								mode: "insensitive",
							},
						},
						{
							buyerPhone: {
								contains: trimmedQuery,
								mode: "insensitive",
							},
						},
					],
				}
			: {}),
	};

	const [orders, grouped, revenue] = await Promise.all([
		prisma.order.findMany({
			where: orderWhere,
			orderBy: { createdAt: "desc" },
			select: {
				id: true,
				orderNumber: true,
				email: true,
				status: true,
				total: true,
				currency: true,
				paymentMethod: true,
				buyerName: true,
				buyerSurname: true,
				buyerPhone: true,
				cancelReason: true,
				createdAt: true,
				updatedAt: true,
				orderItems: {
					select: {
						id: true,
						quantity: true,
						price: true,
						tickets: {
							select: {
								id: true,
								name: true,
							},
						},
						_count: {
							select: { participants: true },
						},
					},
				},
			},
		}),
		prisma.order.groupBy({
			by: ["status"],
			where: { eventId },
			_count: { _all: true },
		}),
		prisma.order.aggregate({
			where: {
				eventId,
				status: { in: activeRevenueStatuses },
			},
			_sum: { total: true },
		}),
	]);

	const statusCount = (orderStatus: OrderStatus) =>
		grouped.find((item) => item.status === orderStatus)?._count._all ?? 0;

	return {
		event,
		orders: orders.map((order) => ({
			...order,
			createdAt: order.createdAt.toISOString(),
			updatedAt: order.updatedAt.toISOString(),
			itemsCount: order.orderItems.reduce(
				(sum, item) => sum + item.quantity,
				0,
			),
			participantsCount: order.orderItems.reduce(
				(sum, item) => sum + item._count.participants,
				0,
			),
			tickets: order.orderItems.map((item) => ({
				id: item.tickets.id,
				name: item.tickets.name,
				quantity: item.quantity,
				price: item.price,
			})),
		})),
		summary: {
			total: grouped.reduce((sum, item) => sum + item._count._all, 0),
			pending: statusCount(OrderStatus.PENDING),
			confirmed: statusCount(OrderStatus.CONFIRMED),
			paid: statusCount(OrderStatus.PAID),
			cancelled: statusCount(OrderStatus.CANCELLED),
			expired: statusCount(OrderStatus.EXPIRED),
			revenue: revenue._sum.total ?? 0,
		},
	};
}
