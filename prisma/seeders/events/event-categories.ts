import { Event, PrismaClient } from "@prisma/client";

const categoriesData = [
	{ name: "Koncert", slug: "koncert", icon: "🎵" },
	{ name: "Konferencja", slug: "konferencja", icon: "🎤" },
	{ name: "Warsztat", slug: "warsztat", icon: "🛠️" },
	{ name: "Sport", slug: "sport", icon: "⚽" },
	{ name: "Sztuka", slug: "sztuka", icon: "🎨" },
	{ name: "Biznes", slug: "biznes", icon: "💼" },
];

export const createCategories = async (
	prisma: PrismaClient,
	events: Event[],
) => {
	console.log("🔥 Creating categories events ---------------------");

	// Создаём категории и сохраняем с id
	const categories = [];
	for (const category of categoriesData) {
		const created = await prisma.eventCategory.upsert({
			where: { slug: category.slug },
			update: {},
			create: category,
		});
		categories.push(created);
		console.log(`➕ create category: ${created.name}`);
	}

	console.log("🔥 Join events and categories ---------------------");
	// Привязываем рандомную категорию к каждому событию
	for (const event of events) {
		console.log(`➕ join event: ${event.id}`);
		const randomCategory =
			categories[Math.floor(Math.random() * categories.length)];

		// Проверяем чтобы не дублировать
		await prisma.eventCategoryOnEvent.upsert({
			where: {
				eventId_categoryId: {
					eventId: event.id,
					categoryId: randomCategory.id,
				},
			},
			update: {},
			create: {
				eventId: event.id,
				categoryId: randomCategory.id,
			},
		});
	}
};
