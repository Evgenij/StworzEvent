import prisma from "../prisma";
import { slugify } from "./slugify";

export async function generateUniqueSlug(title: string): Promise<string> {
	const base = slugify(title);
	let slug = base;
	let counter = 2;

	while (await prisma.event.findUnique({ where: { slug } })) {
		slug = `${base}-${counter++}`;
	}

	return slug;
}
