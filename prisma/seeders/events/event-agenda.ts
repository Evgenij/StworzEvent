import { Event, EventAgendaItem, PrismaClient } from "@prisma/client";

const agendaItemsData = [
	{
		title: "Rejestracja i powitalna kawa",
		description: "Rejestracja uczestników, networking przy kawie",
		startsAt: new Date("2026-03-15T09:00:00"),
		endsAt: new Date("2026-03-15T10:00:00"),
		location: "Lobby",
		speakerName: null,
		order: 1,
	},
	{
		title: "Otwarcie konferencji",
		description: "Oficjalne otwarcie wydarzenia i przywitanie gości",
		startsAt: new Date("2026-03-15T10:00:00"),
		endsAt: new Date("2026-03-15T10:30:00"),
		location: "Sala główna",
		speakerName: "Mateusz Pacerowski",
		order: 2,
	},
	{
		title: "Keynote: Przyszłość technologii",
		description: "Główny wykład o trendach w branży tech",
		startsAt: new Date("2026-03-15T10:30:00"),
		endsAt: new Date("2026-03-15T11:45:00"),
		location: "Sala główna",
		speakerName: "Anna Nowak",
		order: 3,
	},
	{
		title: "Przerwa kawowa",
		description: null,
		startsAt: new Date("2026-03-15T11:45:00"),
		endsAt: new Date("2026-03-15T12:15:00"),
		location: "Lobby",
		speakerName: null,
		order: 4,
	},
	{
		title: "Warsztat: AI w praktyce",
		description: "Praktyczne zastosowanie AI w codziennej pracy",
		startsAt: new Date("2026-03-15T12:15:00"),
		endsAt: new Date("2026-03-15T13:30:00"),
		location: "Sala B",
		speakerName: "Marta Zielińska",
		order: 5,
	},
	{
		title: "Lunch",
		description: null,
		startsAt: new Date("2026-03-15T13:30:00"),
		endsAt: new Date("2026-03-15T14:30:00"),
		location: "Restauracja",
		speakerName: null,
		order: 6,
	},
	{
		title: "Panel dyskusyjny",
		description: "Dyskusja ekspertów na temat innowacji w biznesie",
		startsAt: new Date("2026-03-15T14:30:00"),
		endsAt: new Date("2026-03-15T15:45:00"),
		location: "Sala główna",
		speakerName: "Piotr Wiśniewski",
		order: 7,
	},
	{
		title: "Zakończenie i networking",
		description: "Podsumowanie dnia, networking przy drinku",
		startsAt: new Date("2026-03-15T15:45:00"),
		endsAt: new Date("2026-03-15T17:00:00"),
		location: "Lobby",
		speakerName: null,
		order: 8,
	},
];

export const createEventAgendaItems = async (
	prisma: PrismaClient,
	events: Event[],
) => {
	console.log("🔥 Creating event agenda items ---------------------");

	for (const event of events) {
		await prisma.eventAgendaItem.deleteMany({
			where: { eventId: event.id },
		});

		console.log(`➕ create agenda items for event: ${event.id}`);
		await prisma.eventAgendaItem.createMany({
			data: agendaItemsData.map((item) => ({
				...item,
				eventId: event.id,
			})),
		});
	}
};
