import { Event, PrismaClient } from "@prisma/client";

const faqsData = [
	{
		question: "Jak kupić bilety?",
		answer: "Bilety można kupić online na naszej stronie lub w kasie przed wydarzeniem.",
		order: 1,
	},
	{
		question: "Czy można zwrócić bilet?",
		answer: "Zwrot biletu jest możliwy do 7 dni przed wydarzeniem.",
		order: 2,
	},
	{
		question: "Czy jest parking?",
		answer: "Tak, parking jest dostępny bezpłatnie dla uczestników.",
		order: 3,
	},
	{
		question: "Czy można przyjść z dziećmi?",
		answer: "Tak, wydarzenie jest otwarte dla wszystkich grup wiekowych.",
		order: 4,
	},
];

export const createEventFaqs = async (
	prisma: PrismaClient,
	events: Event[],
) => {
	console.log("🔥 Creating event's faqs ---------------------");
	for (const event of events) {
		await prisma.eventFaq.deleteMany({ where: { eventId: event.id } });

		console.log("➕ Adding faqs for event with id: ", event.id);
		await prisma.eventFaq.createMany({
			data: faqsData.map((faq) => ({
				...faq,
				eventId: event.id,
			})),
		});
	}
};
