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
	},
});

export type EventWithCategories = Prisma.EventGetPayload<
	typeof eventWithCategoriesArgs
>;
