import { Event, PrismaClient } from "@prisma/client";

// Per-event ticket configs (index matches EVENT_DATA in events.ts)
const EVENT_TICKETS: Array<{ name: string; price: number; quantity: number | null }[]> = [
	// 0 — Jazz Jam: trzy typy, jeden bez limitu
	[
		{ name: "Wejście standardowe", price: 8000, quantity: 120 },
		{ name: "Wejście VIP", price: 19900, quantity: 20 },
		{ name: "Karnety (5 nocy)", price: 29900, quantity: null },
	],
	// 1 — Festiwal Filmów: jeden typ, duża pojemność
	[
		{ name: "Bilet festiwalowy", price: 5500, quantity: 300 },
	],
	// 2 — Bieg Uliczny: dwa typy, bardzo duże limity
	[
		{ name: "Pakiet startowy Standard", price: 9900, quantity: 800 },
		{ name: "Pakiet startowy Premium", price: 17900, quantity: 200 },
	],
	// 3 — Konferencja AI: małe limity — ekskluzywna konferencja
	[
		{ name: "Bilet Early Bird", price: 49900, quantity: 30 },
		{ name: "Bilet regularny", price: 79900, quantity: 60 },
		{ name: "VIP + Networking", price: 149900, quantity: 10 },
	],
	// 4 — Open Air Music Fest: masowa impreza
	[
		{ name: "Wejście jednodniowe", price: 12900, quantity: 2000 },
		{ name: "Karnet weekendowy", price: 21900, quantity: 500 },
		{ name: "Strefa VIP", price: 49900, quantity: 100 },
	],
	// 5 — Targi Eko: bez limitu
	[
		{ name: "Wejście (wolny wstęp)", price: 0, quantity: null },
	],
	// 6 — Warsztaty Fotograficzne: bardzo mała grupa
	[
		{ name: "Miejsce uczestnika", price: 34900, quantity: 12 },
	],
	// 7 — Hackathon Zimowy: ograniczone miejsca
	[
		{ name: "Bilet indywidualny", price: 19900, quantity: 40 },
		{ name: "Bilet zespołowy (3 os.)", price: 49900, quantity: 10 },
	],
	// 8 — Dni Otwarte Muzeum: wstęp i oprowadzanie
	[
		{ name: "Wstęp wolny", price: 0, quantity: null },
		{ name: "Oprowadzanie z przewodnikiem", price: 2900, quantity: 50 },
	],
	// 9 — Koncert Charytatywny: dwa sektory
	[
		{ name: "Parter (stojący)", price: 7900, quantity: 400 },
		{ name: "Balkon (siedzący)", price: 12900, quantity: 150 },
	],
	// 10 — Kongres Innowacji: wielopoziomowy bilet
	[
		{ name: "Bilet jednodniowy", price: 99900, quantity: 200 },
		{ name: "Bilet dwudniowy", price: 169900, quantity: 100 },
		{ name: "Pakiet Sponsor", price: 499900, quantity: 15 },
	],
	// 11 — Stand-up Comedy Night: jedna sala, mały limit
	[
		{ name: "Bilet wstępu", price: 6900, quantity: 120 },
	],
	// 12 — Finał Ligi Startupów: dwa typy
	[
		{ name: "Bilet uczestnika", price: 24900, quantity: 80 },
		{ name: "Bilet inwestora", price: 99900, quantity: 20 },
	],
	// 13 — Festiwal Kultury Ukraińskiej: rodzinna impreza
	[
		{ name: "Bilet ulgowy (dzieci/studenci)", price: 1500, quantity: 200 },
		{ name: "Bilet normalny", price: 3000, quantity: 400 },
		{ name: "Karnety rodzinne (2+2)", price: 8000, quantity: 80 },
	],
	// 14 — Obóz Programistyczny: bardzo limitowany
	[
		{ name: "Uczestnik (pełny obóz)", price: 199900, quantity: 20 },
		{ name: "Mentor / Prowadzący", price: 0, quantity: 5 },
	],
];

export const createTickets = async (prisma: PrismaClient, events: Event[]) => {
	console.log("🔥 Creating tickets events ---------------------");

	for (const [index, event] of events.entries()) {
		await prisma.ticket.deleteMany({ where: { eventId: event.id } });

		const config = EVENT_TICKETS[index] ?? EVENT_TICKETS[0];
		console.log(`➕ Adding tickets for event[${index}]: ${event.id}`);

		await prisma.ticket.createMany({
			data: config.map((t) => ({ eventId: event.id, ...t })),
		});
	}
};
