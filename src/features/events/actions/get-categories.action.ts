// src/actions/events/get-categories.action.ts
"use server";

import prisma from "@/lib/prisma";

export async function getCategories() {
	return prisma.eventCategory.findMany({
		where: { parentId: null }, // только верхний уровень
		select: { id: true, name: true, slug: true, icon: true },
		orderBy: { name: "asc" },
	});
}

export type CategoryOption = Awaited<ReturnType<typeof getCategories>>[number];
