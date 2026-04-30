"use server";

import prisma from "@/lib/prisma";

export async function getOrderPaymentDetailsAction(
	orderId: string,
	email: string,
) {
	const order = await prisma.order.findFirst({
		where: { id: orderId, email },
		select: {
			id: true,
			orderNumber: true,
			status: true,
			total: true,
			currency: true,
			paymentMethod: true,
			paymentBankAccount: true,
			paymentBankHolder: true,
			paymentLink: true,
			paymentInstructions: true,
			buyerName: true,
			buyerSurname: true,
			events: { select: { title: true, slug: true, startsAt: true } },
		},
	});
	return order;
}
