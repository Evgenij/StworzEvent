"use server";

import prisma from "@/lib/prisma";
import { getMinTicketPrice } from "@/helpers/event";
import { CategoryOption } from "@/actions/events/get-categories.action";
import { EventItemData } from "@/components/events/event-item";
import { EventStatus } from "@prisma/client";

const PAGE_SIZE = 12;

export type EventCatalogItem = EventItemData & {
	id: string;
	minPrice: number | null;
	category: CategoryOption | null;
};

export const getEventsPage = async (
	skip = 0,
): Promise<{ items: EventCatalogItem[]; hasMore: boolean }> => {
	// Загружаем с запасом, чтобы учесть распроданные события
	const FETCH_LIMIT = (PAGE_SIZE + 1) * 2;

	const events = await prisma.event.findMany({
		where: { status: EventStatus.PUBLISHED },
		skip,
		take: FETCH_LIMIT,
		orderBy: { startsAt: "asc" },
		include: {
			tickets: {
				include: {
					orderItems: {
						where: {
							orders: {
								status: { in: ["CONFIRMED", "PAID", "PENDING"] },
							},
						},
						select: { quantity: true },
					},
				},
			},
			categories: {
				include: { category: true },
				take: 1,
			},
		},
	});

	// Фильтруем распроданные — хотя бы один билет должен быть доступен
	const available = events.filter((event) =>
		event.tickets.some((ticket) => {
			if (ticket.quantity === null) return true;
			const sold = ticket.orderItems.reduce(
				(sum, oi) => sum + oi.quantity,
				0,
			);
			return ticket.quantity - sold > 0;
		}),
	);

	const hasMore = available.length > PAGE_SIZE;
	const page = available.slice(0, PAGE_SIZE);

	const items: EventCatalogItem[] = page.map((event) => ({
		id: event.id,
		coverImage: event.coverImage,
		title: event.title,
		startsAt: event.startsAt,
		location: event.location,
		street: event.street,
		streetNumber: event.streetNumber,
		slug: event.slug,
		minPrice: getMinTicketPrice(event.tickets),
		category: event.categories[0]?.category ?? null,
	}));

	return { items, hasMore };
};
