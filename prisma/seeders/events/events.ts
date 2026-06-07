import { Event, EventStatus, Organization, PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { createCategories } from "./event-categories";
import { createSections } from "./event-sections";
import { createEventFaqs } from "./event-faqs";
import { createEventAgendaItems } from "./event-agenda";
import { createTickets } from "./event-tickes";
import { createOrders } from "./event-orders";
import { DateTimeFormatter } from "@/helpers/date";

const EVENT_DATA = [
	// Прошедшие (~ 6 мес. назад)
	{
		title: "Jazz Jam",
		daysOffset: -180,
		location: "Kraków",
		street: "Floriańska",
		streetNumber: "3",
		lat: 50.06264,
		lng: 19.93659,
	},
	{
		title: "Festiwal Filmów Dokumentalnych",
		daysOffset: -150,
		location: "Warszawa",
		street: "Marszałkowska",
		streetNumber: "120",
		lat: 52.22977,
		lng: 21.01178,
	},
	{
		title: "Bieg Uliczny im. Marii Skłodowskiej-Curie",
		daysOffset: -120,
		location: "Lublin",
		street: "Krakowskie Przedmieście",
		streetNumber: "52",
		lat: 51.24645,
		lng: 22.56844,
	},
	// Прошедшие (~ 1-3 мес. назад)
	{
		title: "Konferencja AI & Biznes 2026",
		daysOffset: -90,
		location: "Wrocław",
		street: "Świdnicka",
		streetNumber: "8",
		lat: 51.10788,
		lng: 17.03854,
	},
	{
		title: "Open Air Music Fest",
		daysOffset: -60,
		location: "Gdańsk",
		street: "Długa",
		streetNumber: "47",
		lat: 54.35203,
		lng: 18.64664,
	},
	{
		title: "Targi Eko",
		daysOffset: -45,
		location: "Poznań",
		street: "Półwiejska",
		streetNumber: "1",
		lat: 52.40692,
		lng: 16.92993,
	},
	// Прошедшие (~ 1-3 нед. назад)
	{
		title: "Warsztaty Fotograficzne — Portret w Naturalnym Świetle",
		daysOffset: -21,
		location: "Łódź",
		street: "Piotrkowska",
		streetNumber: "100",
		lat: 51.77202,
		lng: 19.47991,
	},
	{
		title: "Hackathon Zimowy",
		daysOffset: -10,
		location: "Katowice",
		street: "Stawowa",
		streetNumber: "21",
		lat: 50.26489,
		lng: 19.02376,
	},
	// Предстоящие (~ 1-3 нед.)
	{
		title: "Dni Otwarte Muzeum Narodowego",
		daysOffset: 7,
		location: "Kraków",
		street: "3 Maja",
		streetNumber: "1",
		lat: 50.06122,
		lng: 19.93397,
	},
	{
		title: "Koncert Charytatywny",
		daysOffset: 14,
		location: "Rzeszów",
		street: "3 Maja",
		streetNumber: "5",
		lat: 50.04132,
		lng: 21.99901,
	},
	// Предстоящие (~ 1-3 мес.)
	{
		title: "Międzynarodowy Kongres Innowacji i Technologii Przyszłości",
		daysOffset: 30,
		location: "Warszawa",
		street: "Aleje Jerozolimskie",
		streetNumber: "65/79",
		lat: 52.22755,
		lng: 21.00395,
	},
	{
		title: "Stand-up Comedy Night",
		daysOffset: 45,
		location: "Gdynia",
		street: "Świętojańska",
		streetNumber: "30",
		lat: 54.51889,
		lng: 18.53188,
	},
	{
		title: "Finał Ligi Startupów Polska",
		daysOffset: 60,
		location: "Wrocław",
		street: "Plac Solny",
		streetNumber: "12",
		lat: 51.10988,
		lng: 17.02998,
	},
	// Предстоящие (~ 4-6 мес.)
	{
		title: "Festiwal Kultury Ukraińskiej",
		daysOffset: 90,
		location: "Kraków",
		street: "Kazimierz — Szeroka",
		streetNumber: "2",
		lat: 50.0514,
		lng: 19.9477,
	},
	{
		title: "Letni Obóz Programistyczny dla Młodzieży — JavaScript od Zera do Bohatera",
		daysOffset: 150,
		location: "Zakopane",
		street: "Krupówki",
		streetNumber: "22",
		lat: 49.29944,
		lng: 19.95132,
	},
];

const daysFromNow = (days: number): string => {
	const d = new Date();
	d.setDate(d.getDate() + days);
	return DateTimeFormatter.timeISO(d);
};

export const createEvents = async (
	organization: Organization,
	prisma: PrismaClient,
) => {
	console.log("🔥 Creating events ---------------------");

	const allStatuses = Object.values(EventStatus) as EventStatus[];
	const events = [] as Event[];

	for (let index = 0; index < EVENT_DATA.length; index++) {
		const meta = EVENT_DATA[index];
		const randomStatus =
			allStatuses[Math.floor(Math.random() * allStatuses.length)];

		console.log(`➕ create event: event-id-${index + 1} — ${meta.title}`);

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
							text: `Zapraszamy na „${meta.title}"! To niepowtarzalna okazja, aby spędzić czas w gronie przyjaciół i rodziny, ciesząc się wspaniałą atmosferą i atrakcjami.`,
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
			where: { slug: `slug-event-${index + 1}` },
			update: {},
			create: {
				id: `event-id-${index + 1}`,
				slug: `slug-event-${index + 1}`,
				location: meta.location,
				street: meta.street,
				streetNumber: meta.streetNumber,
				lat: meta.lat,
				lng: meta.lng,
				coverImage: `https://picsum.photos/1200/400?random=${index + 1}`,
				description: richTextDescription,
				organizationId: organization.id,
				title: meta.title,
				startsAt: daysFromNow(meta.daysOffset),
				status: randomStatus,
				paymentMethod: "BANK_TRANSFER",
				bankAccountNumber: "PL61109010140000071219812874",
				bankAccountHolder: "UIXER company sp. z o.o.",
				paymentInstructions:
					"W tytule przelewu wpisz numer zamowienia.",
			},
		});
		events.push(event);
	}

	await createCategories(prisma, events);
	await createEventAgendaItems(prisma, events);
	await createSections(prisma, events);
	await createEventFaqs(prisma, events);
	await createTickets(prisma, events);
	await createOrders(prisma, events);
};
