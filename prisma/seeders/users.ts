import { hashPassword } from "@/lib/hash-password";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { createOrganizations } from "./organizations";

export const createUsers = async (prisma: PrismaClient) => {
	console.log("🔥 Creating users ---------------------");

	console.log("➕ create admin");
	const admin = await prisma.user.upsert({
		where: { email: "yevhenii.uixer@gmail.com" },
		update: {},
		create: {
			id: uuidv4(),
			name: "Yevhenii",
			surname: "Yermolenko",
			email: "yevhenii.uixer@gmail.com",
			role: "ADMIN",
		},
	});

	await prisma.account.upsert({
		where: {
			providerId_accountId: {
				providerId: "credential",
				accountId: admin.email,
			},
		},
		update: {},
		create: {
			id: uuidv4(),
			userId: admin.id,
			accountId: admin.email,
			providerId: "credential",
			password: await hashPassword("password"),
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	});

	// Создание организатора
	console.log("➕ create organizer");
	const organizer = await prisma.user.upsert({
		where: { email: "evgeniu.ermolenko@gmail.com" },
		update: {},
		create: {
			id: uuidv4(),
			name: "Yevhenii",
			surname: "Yermolenko",
			email: "evgeniu.ermolenko@gmail.com",
			role: "ORGANIZER",
		},
	});

	await prisma.account.upsert({
		where: {
			providerId_accountId: {
				providerId: "credential",
				accountId: organizer.email,
			},
		},
		update: {},
		create: {
			id: uuidv4(),
			userId: organizer.id,
			accountId: organizer.email,
			providerId: "credential",
			password: await hashPassword("password"),
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	});

	await createOrganizations(organizer, prisma);
};
