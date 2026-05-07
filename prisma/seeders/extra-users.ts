import { hashPassword } from "@/lib/hash-password";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const regularUsers = [
	{ name: "Anna", surname: "Kowalska", email: "anna.kowalska@example.com" },
	{ name: "Piotr", surname: "Nowak", email: "piotr.nowak@example.com" },
	{ name: "Marta", surname: "Zielinska", email: "marta.zielinska@example.com" },
	{ name: "Kamil", surname: "Wisniewski", email: "kamil.wisniewski@example.com" },
	{ name: "Olga", surname: "Lewandowska", email: "olga.lewandowska@example.com" },
];

export const createExtraUsers = async (prisma: PrismaClient) => {
	console.log("🔥 Creating regular users ---------------------");

	for (const userData of regularUsers) {
		console.log(`➕ create user: ${userData.email}`);

		const user = await prisma.user.upsert({
			where: { email: userData.email },
			update: {},
			create: {
				id: uuidv4(),
				name: userData.name,
				surname: userData.surname,
				email: userData.email,
				role: "USER",
				emailVerified: true,
			},
		});

		await prisma.account.upsert({
			where: {
				providerId_accountId: {
					providerId: "credential",
					accountId: user.email,
				},
			},
			update: {},
			create: {
				id: uuidv4(),
				userId: user.id,
				accountId: user.email,
				providerId: "credential",
				password: await hashPassword("password"),
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		});
	}
};
