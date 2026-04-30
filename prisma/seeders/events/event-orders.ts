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

const orderBlueprints = [
	{
		status: OrderStatus.PENDING,
		quantities: [1, 0, 0],
		paymentStatus: PaymentStatus.PENDING,
		cancelReason: null,
	},
	{
		status: OrderStatus.CONFIRMED,
		quantities: [2, 1, 0],
		paymentStatus: PaymentStatus.SUCCEEDED,
		cancelReason: null,
	},
	{
		status: OrderStatus.PAID,
		quantities: [1, 1, 0],
		paymentStatus: PaymentStatus.SUCCEEDED,
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

const participantNames = [
	["Jan", "Kowalski"],
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

export const createOrders = async (
	prisma: PrismaClient,
	events: Event[],
) => {
	console.log("Creating event orders ---------------------");

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
			console.log(`No tickets for event with id: ${event.id}`);
			continue;
		}

		console.log("Adding orders for event with id: ", event.id);

		for (const [orderIndex, blueprint] of orderBlueprints.entries()) {
			const buyer = buyers[(eventIndex + orderIndex) % buyers.length];
			const selectedItems = blueprint.quantities.flatMap(
				(quantity, ticketIndex) => {
					const ticket = tickets[ticketIndex];
					if (quantity <= 0 || !ticket) return [];

					return [{ quantity: Number(quantity), ticket }];
				},
			);

			const total = selectedItems.reduce(
				(sum, item) => sum + item.ticket.price * item.quantity,
				0,
			);
			const orderNumber = `SEED-${String(eventIndex + 1).padStart(
				2,
				"0",
			)}-${String(orderIndex + 1).padStart(2, "0")}`;
			const createdAt = createdAtFor(eventIndex, orderIndex);
			const user = users[(eventIndex + orderIndex) % users.length];

			const order = await prisma.order.create({
				data: {
					eventId: event.id,
					userId: orderIndex % 2 === 0 ? user?.id : null,
					email: buyer.email,
					buyerName: buyer.name,
					buyerSurname: buyer.surname,
					buyerPhone: buyer.phone,
					status: blueprint.status,
					total,
					currency: Currency.PLN,
					orderNumber,
					cancelReason: blueprint.cancelReason,
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
								create: Array.from({
									length: item.quantity,
								}).map((_, participantIndex) =>
									participantFor(
										eventIndex,
										orderIndex,
										itemIndex,
										participantIndex,
										buyer,
									),
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
					status: blueprint.paymentStatus,
					createdAt,
					updatedAt: createdAt,
				},
			});

			if (blueprint.status === OrderStatus.CANCELLED && total > 0) {
				await prisma.refund.create({
					data: {
						paymentId: payment.id,
						amount: total,
						currency: Currency.PLN,
						reason: blueprint.cancelReason,
						status: RefundStatus.SUCCEEDED,
						providerRefundId: `seed-refund-${orderNumber}`,
						createdAt,
						updatedAt: createdAt,
					},
				});
			}
		}
	}
};
