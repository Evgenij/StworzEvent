import { hashPassword } from "@/lib/hashPassword";
import prisma from "@/lib/prisma";
import { listOrganizers } from "@/mocks";
import { v4 as uuidv4 } from "uuid";

async function main() {
	console.info("Start seeding...");

	// Очистка базы (опционально, но полезно при разработке)
	await prisma.user.deleteMany();

	// Создание данных

	// INVITATIONS

	for (const invitation of listOrganizers) {
		await prisma.invitation.upsert({
			where: { email: invitation.email },
			update: {},
			create: invitation,
		});
	}

	// await prisma.invitation.upsert({
	// 	where: { email: "evgeniu.ermolenko@gmail.com" },
	// 	update: {},
	// 	create: {
	// 		id: uuidv4(),
	// 		name: "Yevhenii",
	// 		surname: "Yermolenko",
	// 		email: "evgeniu.ermolenko@gmail.com",
	// 		token: uuidv4(),
	// 		expiresAt: tokensExpires,
	// 	},
	// });

	// Создание администратора
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

	console.info("Seeding finished");
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
