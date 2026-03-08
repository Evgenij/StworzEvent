import { Event, EventStatus, Organization, PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { createCategories } from "./event-categories";
import { createSections } from "./event-sections";
import { createEventFaqs } from "./event-faqs";
import { createEventAgendaItems } from "./event-agenda";

export const createEvents = async (
	organization: Organization,
	prisma: PrismaClient,
) => {
	console.log("🔥 Creating events ---------------------");

	const allStatuses = Object.values(EventStatus) as EventStatus[];
	const COUNT = 15;
	const events = [] as Event[];

	for (let index = 0; index < COUNT; index++) {
		const randomStatus =
			allStatuses[Math.floor(Math.random() * allStatuses.length)];

		console.log(`➕ create event: event-id-${index + 1}`);

		const richTextDescription = {
			type: "doc",
			content: [
				{
					type: "heading",
					attrs: { level: 2 },
					content: [{ type: "text", text: "O wydarzeniu" }],
				},
				{
					type: "paragraph",
					content: [
						{
							type: "text",
							text: `Zapraszamy na wyjątkowe wydarzenie nr ${index + 1}! To niepowtarzalna okazja, aby spędzić czas w gronie przyjaciół i rodziny, ciesząc się wspaniałą atmosferą i atrakcjami.`,
						},
					],
				},
				{
					type: "heading",
					attrs: { level: 2 },
					content: [{ type: "text", text: "Co nas czeka?" }],
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
											text: "Występy znanych artystów",
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
											text: "Strefa gastronomiczna z lokalnymi przysmakami",
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
											text: "Atrakcje dla dzieci i dorosłych",
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
											text: "Warsztaty i pokazy na żywo",
										},
									],
								},
							],
						},
					],
				},
				{
					type: "paragraph",
					content: [
						{
							type: "text",
							text: "Nie przegap tej wyjątkowej okazji! Bilety dostępne są w ograniczonej ilości.",
						},
					],
				},
			],
		};

		const event = await prisma.event.upsert({
			where: { id: `event-id-${index + 1}` },
			update: {},
			create: {
				id: `event-id-${index + 1}`,
				location: `Kraków`,
				address: `Drukarska 8`,
				lat: 50.06465,
				lng: 19.94498,
				coverImage: `https://picsum.photos/1200/400?random=${index + 1}`,
				description: richTextDescription,
				organizationId: organization.id,
				title: `Test Event ${index + 1}`,
				startsAt: new Date(),
				status: randomStatus,
			},
		});
		events.push(event);
	}

	await createCategories(prisma, events);
	await createEventAgendaItems(prisma, events);
	await createSections(prisma, events);
	await createEventFaqs(prisma, events);
};
