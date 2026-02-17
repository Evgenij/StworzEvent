import { hashPassword } from "@/lib/hashPassword";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

async function main() {
	console.info("Start seeding...");

	// Очистка базы (опционально, но полезно при разработке)
	await prisma.user.deleteMany();

	// Создание данных
	const user = await prisma.user.upsert({
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

	// 7 дней * 24 часа * 60 минут * 60 секунд * 1000 миллисекунд
	const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;
	const tokensExpires = new Date(Date.now() + SEVEN_DAYS_IN_MS);

	// Создание данных
	const organizer = await prisma.user.upsert({
		where: { email: "evgeniu.ermolenko@gmail.com" },
		update: {},
		create: {
			id: uuidv4(),
			name: "Yevhenii",
			surname: "Yermolenko",
			email: "evgeniu.ermolenko@gmail.com",
			role: "ORGANIZER",
			inviteToken: uuidv4(),
			inviteExpires: tokensExpires,
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
			password: await hashPassword("04072026"),
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
