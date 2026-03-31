import { Event, PrismaClient, SectionType } from "@prisma/client";

const sections = [
	{
		type: SectionType.IMAGE,
		title: "Galeria",
		content: {
			images: [
				{
					url: "https://picsum.photos/800/400?random=1",
					alt: "Zdjęcie 1",
				},
				{
					url: "https://picsum.photos/800/400?random=2",
					alt: "Zdjęcie 2",
				},
				{
					url: "https://picsum.photos/800/400?random=3",
					alt: "Zdjęcie 3",
				},
			],
		},
		order: 2,
	},
	{
		type: SectionType.VIDEO,
		title: "Wideo",
		content: {
			url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
		},
		order: 4,
	},
	{
		type: SectionType.TEXT,
		title: "Informacje dodatkowe",
		content: {
			type: "doc",
			content: [
				{
					type: "paragraph",
					content: [
						{
							type: "text",
							text: "Tutaj znajdziesz dodatkowe informacje o wydarzeniu.",
						},
					],
				},
				{
					type: "bulletList",
					content: [
						{
							type: "listItem",
							content: [
								{
									type: "paragraph",
									content: [
										{
											type: "text",
											text: "Rejestracja od godziny 9:00",
										},
									],
								},
							],
						},
						{
							type: "listItem",
							content: [
								{
									type: "paragraph",
									content: [
										{
											type: "text",
											text: "Strój formalny wymagany",
										},
									],
								},
							],
						},
						{
							type: "listItem",
							content: [
								{
									type: "paragraph",
									content: [
										{
											type: "text",
											text: "Catering zapewniony",
										},
									],
								},
							],
						},
					],
				},
			],
		},
		order: 6,
	},
	{
		type: SectionType.LINKS,
		title: "Linki",
		content: {
			links: [
				{ url: "https://zoom.us/j/123456789", service: "zoom" },
				{
					url: "https://www.facebook.com/events/123456",
					service: "facebook",
				},
			],
		},
		order: 5,
	},
];

export const createSections = async (prisma: PrismaClient, events: Event[]) => {
	console.log("🔥 Creating sections events ---------------------");

	for (const event of events) {
		// Удаляем старые секции и создаём заново
		await prisma.eventSection.deleteMany({
			where: { eventId: event.id },
		});

		console.log("➕ Adding sections for event with id: ", event.id);
		await prisma.eventSection.createMany({
			data: sections.map((section) => ({
				eventId: event.id,
				...section,
			})),
		});
	}
};
