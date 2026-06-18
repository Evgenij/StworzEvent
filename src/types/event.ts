import { Prisma } from "@prisma/client";

const eventWithCategoriesArgs = Prisma.validator<Prisma.EventDefaultArgs>()({
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

export type EventWithCategories = Prisma.EventGetPayload<
	typeof eventWithCategoriesArgs
>;
