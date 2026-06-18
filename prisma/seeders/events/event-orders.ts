import {
	Currency,
	Event,
	OrderStatus,
	PaymentMethod,
	PaymentStatus,
	PrismaClient,
	RefundStatus,
	Ticket,
} from "@prisma/client";

const buyers = [
	{
		name: "Anna",
		surname: "Kowalska",
		email: "anna.kowalska@example.com",
		phone: "+48 501 100 200",
	},
	{
		name: "Piotr",
		surname: "Nowak",
		email: "piotr.nowak@example.com",
		phone: "+48 502 200 300",
	},
	{
		name: "Marta",
		surname: "Zielinska",
		email: "marta.zielinska@example.com",
		phone: "+48 503 300 400",
	},
	{
		name: "Kamil",
		surname: "Wisniewski",
		email: "kamil.wisniewski@example.com",
		phone: "+48 504 400 500",
	},
	{
		name: "Olga",
		surname: "Lewandowska",
		email: "olga.lewandowska@example.com",
		phone: "+48 505 500 600",
	},
];

const baseBlueprints = [
	{
		status: OrderStatus.PENDING,
		quantities: [1, 0, 0],
		paymentStatus: PaymentStatus.PENDING,
		cancelReason: null,
	},
	{
		status: OrderStatus.CANCELLED,
		quantities: [0, 1, 0],
		paymentStatus: PaymentStatus.REFUNDED,
		cancelReason: "Klient poprosil o anulowanie zamowienia.",
	},
	{
		status: OrderStatus.EXPIRED,
		quantities: [1, 0, 0],
		paymentStatus: PaymentStatus.EXPIRED,
		cancelReason: null,
	},
] as const;

// Per-event extra PAID batches — each sub-array is quantities per ticket type for one order.
// Index matches EVENT_DATA in events.ts.
// These generate PAID (counted in sales stats) orders on top of base blueprints.
const PAID_BATCHES_PER_EVENT: number[][][] = [
	// 0 — Jazz Jam (120, 20, ∞)  → ~70 sold ≈ 55% of capped tickets
	[[5, 1], [4, 2], [6, 0], [4, 1], [5, 0], [4, 1], [5, 2], [4, 1]],
	// 1 — Festiwal Filmów (300)  → ~240 sold ≈ 80%
	[[15], [20], [18], [12], [20], [18], [15], [20], [18], [15], [20], [18], [15], [18], [18]],
	// 2 — Bieg Uliczny (800, 200) → ~130 sold ≈ 13%
	[[10, 2], [8, 1], [12, 3], [10, 2], [8, 1], [10, 0], [8, 2]],
	// 3 — Konferencja AI (30, 60, 10) → ~87 sold ≈ 88%
	[[4, 6, 1], [3, 7, 1], [4, 6, 1], [3, 6, 1], [4, 7, 1], [3, 7, 1], [4, 6, 0], [3, 7, 1]],
	// 4 — Open Air (2000, 500, 100) → ~820 sold ≈ 31%
	[[40, 10, 2], [50, 8, 1], [45, 12, 2], [40, 10, 1], [50, 8, 2], [45, 10, 1], [50, 12, 2], [40, 10, 2]],
	// 5 — Targi Eko (∞) → 47 wejść
	[[8], [6], [9], [7], [8], [9]],
	// 6 — Warsztaty Fotograficzne (12) → 11 sold ≈ 92%
	[[3], [4], [4]],
	// 7 — Hackathon (40, 10) → ~21 sold ≈ 44%
	[[4, 1], [3, 1], [4, 1], [3, 1]],
	// 8 — Dni Otwarte (∞, 50) → 18 oprowadzań
	[[0, 4], [0, 5], [0, 3], [0, 6]],
	// 9 — Koncert Charytatywny (400, 150) → ~375 sold ≈ 68%
	[[20, 8], [25, 10], [20, 8], [25, 9], [20, 8], [25, 10], [20, 8], [25, 9], [20, 7], [25, 8], [20, 8]],
	// 10 — Kongres (200, 100, 15) → ~70 sold ≈ 22%
	[[6, 3, 1], [5, 2, 0], [6, 3, 1], [5, 2, 0]],
	// 11 — Stand-up (120) → 118 sold ≈ 98% (prawie wyprzedany)
	[[10], [12], [11], [10], [12], [11], [10], [12], [11], [10], [9]],
	// 12 — Finał Startupów (80, 20) → ~37 sold ≈ 37%
	[[5, 1], [4, 1], [5, 1], [4, 1], [5, 1]],
	// 13 — Festiwal Kultury (200, 400, 80) → ~410 sold ≈ 61%
	[[10, 20, 4], [8, 18, 3], [10, 20, 4], [8, 18, 3], [10, 20, 4], [8, 18, 3], [10, 20, 4], [8, 18, 3]],
	// 14 — Obóz Programistyczny (20, 5) → 19 sold ≈ 76%
	[[4, 1], [4, 1], [4, 1], [4, 1]],
];

const participantNames = [
	["Mateusz", "Pacerowski"],
	["Ewa", "Nowak"],
	["Pawel", "Mazur"],
	["Magda", "Kaczmarek"],
	["Tomasz", "Wojcik"],
	["Karolina", "Kaminska"],
	["Michal", "Lewandowski"],
	["Alicja", "Zajac"],
];

const paymentSnapshot = {
	paymentMethod: PaymentMethod.BANK_TRANSFER,
	paymentBankAccount: "PL61109010140000071219812874",
	paymentBankHolder: "UIXER company sp. z o.o.",
	paymentInstructions:
		"W tytule przelewu wpisz numer zamowienia. Rezerwacja zostanie potwierdzona po zaksiegowaniu platnosci.",
};

const createdAtFor = (eventIndex: number, orderIndex: number) => {
	const createdAt = new Date();
	createdAt.setDate(createdAt.getDate() - eventIndex - orderIndex);
	createdAt.setMinutes(createdAt.getMinutes() - orderIndex * 11);
	return createdAt;
};

const participantFor = (
	eventIndex: number,
	orderIndex: number,
	itemIndex: number,
	participantIndex: number,
	buyer: (typeof buyers)[number],
) => {
	const [name, surname] =
		participantNames[
			(eventIndex + orderIndex + itemIndex + participantIndex) %
				participantNames.length
		];

	return {
		name,
		surname,
		email: participantIndex === 0 ? buyer.email : undefined,
		phone: participantIndex === 0 ? buyer.phone : undefined,
	};
};

const createOrder = async (
	prisma: PrismaClient,
	params: {
		event: Event;
		tickets: { id: string; price: number }[];
		quantities: number[];
		status: OrderStatus;
		paymentStatus: PaymentStatus;
		cancelReason: string | null;
		orderNumber: string;
		buyer: (typeof buyers)[number];
		userId: string | null;
		createdAt: Date;
	},
) => {
	const { event, tickets, quantities, status, paymentStatus, cancelReason, orderNumber, buyer, userId, createdAt } = params;

	const selectedItems = quantities.flatMap((qty, i) => {
		const ticket = tickets[i];
		if (qty <= 0 || !ticket) return [];
		return [{ quantity: qty, ticket }];
	});

	if (selectedItems.length === 0) return;

	const total = selectedItems.reduce((sum, item) => sum + item.ticket.price * item.quantity, 0);

	const order = await prisma.order.create({
		data: {
			eventId: event.id,
			userId,
			email: buyer.email,
			buyerName: buyer.name,
			buyerSurname: buyer.surname,
			buyerPhone: buyer.phone,
			status,
			total,
			currency: Currency.PLN,
			orderNumber,
			cancelReason,
			createdAt,
			updatedAt: createdAt,
			...paymentSnapshot,
			orderItems: {
				create: selectedItems.map((item, itemIndex) => ({
					ticketId: item.ticket.id,
					quantity: item.quantity,
					price: item.ticket.price,
					createdAt,
					updatedAt: createdAt,
					participants: {
						create: Array.from({ length: item.quantity }).map((_, pi) =>
							participantFor(0, itemIndex, 0, pi, buyer),
						),
					},
				})),
			},
		},
	});

	const payment = await prisma.payment.create({
		data: {
			orderId: order.id,
			userId: order.userId,
			provider: "seed",
			providerPaymentId: `seed-payment-${orderNumber}`,
			amount: total,
			currency: Currency.PLN,
			status: paymentStatus,
			createdAt,
			updatedAt: createdAt,
		},
	});

	if (status === OrderStatus.CANCELLED && total > 0) {
		await prisma.refund.create({
			data: {
				paymentId: payment.id,
				amount: total,
				currency: Currency.PLN,
				reason: cancelReason,
				status: RefundStatus.SUCCEEDED,
				providerRefundId: `seed-refund-${orderNumber}`,
				createdAt,
				updatedAt: createdAt,
			},
		});
	}
};

export const createOrders = async (prisma: PrismaClient, events: Event[]) => {
	console.log("🔥 Creating event orders ---------------------");

	const users = await prisma.user.findMany({
		select: { id: true, email: true },
		orderBy: { createdAt: "asc" },
	});

	for (const [eventIndex, event] of events.entries()) {
		const tickets = await prisma.ticket.findMany({
			where: { eventId: event.id },
			orderBy: { price: "asc" },
		});

		if (tickets.length === 0) {
			console.log(`No tickets for event ${event.id}`);
			continue;
		}

		console.log(`➕ Adding orders for event[${eventIndex}]: ${event.id}`);

		let orderCounter = 0;

		// Base non-sales orders (pending, cancelled, expired) — same for all events
		for (const blueprint of baseBlueprints) {
			orderCounter++;
			const buyer = buyers[(eventIndex + orderCounter) % buyers.length];
			const user = users[(eventIndex + orderCounter) % users.length];
			await createOrder(prisma, {
				event,
				tickets,
				quantities: blueprint.quantities as unknown as number[],
				status: blueprint.status,
				paymentStatus: blueprint.paymentStatus,
				cancelReason: blueprint.cancelReason,
				orderNumber: `SEED-${String(eventIndex + 1).padStart(2, "0")}-${String(orderCounter).padStart(3, "0")}`,
				buyer,
				userId: orderCounter % 2 === 0 ? user?.id : null,
				createdAt: createdAtFor(eventIndex, orderCounter),
			});
		}

		// Per-event PAID orders — drive the sold-ticket stats
		const paidBatches = PAID_BATCHES_PER_EVENT[eventIndex] ?? [];
		for (const quantities of paidBatches) {
			orderCounter++;
			const buyer = buyers[(eventIndex + orderCounter) % buyers.length];
			const user = users[(eventIndex + orderCounter) % users.length];
			await createOrder(prisma, {
				event,
				tickets,
				quantities,
				status: OrderStatus.PAID,
				paymentStatus: PaymentStatus.SUCCEEDED,
				cancelReason: null,
				orderNumber: `SEED-${String(eventIndex + 1).padStart(2, "0")}-${String(orderCounter).padStart(3, "0")}`,
				buyer,
				userId: orderCounter % 2 === 0 ? user?.id : null,
				createdAt: createdAtFor(eventIndex, orderCounter),
			});
		}
	}
};
