import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email/send-email";
import { TypeMail } from "@/types/enums";
import { APP_CONFIG } from "@/config/app";
import { OrderStatus } from "@prisma/client";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
	const authHeader = req.headers.get("Authorization");
	const cronSecret = process.env.CRON_SECRET;

	if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const now = new Date();
	const from = new Date(now.getTime() + 23 * 60 * 60 * 1000);
	const to = new Date(now.getTime() + 25 * 60 * 60 * 1000);

	const orders = await prisma.order.findMany({
		where: {
			status: OrderStatus.CONFIRMED,
			reminderSentAt: null,
			deletedAt: null,
			events: {
				startsAt: { gte: from, lt: to },
			},
		},
		select: {
			id: true,
			email: true,
			buyerName: true,
			orderNumber: true,
			events: {
				select: {
					title: true,
					slug: true,
					startsAt: true,
					location: true,
					street: true,
				},
			},
		},
	});

	let sent = 0;
	let failed = 0;

	for (const order of orders) {
		if (!order.email) continue;

		const event = order.events;

		const formattedDate = new Intl.DateTimeFormat("pl-PL", {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			timeZone: "Europe/Warsaw",
		}).format(event.startsAt);

		const locationParts = [event.street, event.location].filter(Boolean);
		const eventLocation = locationParts.length
			? locationParts.join(", ")
			: null;

		try {
			await sendEmail({
				to: order.email,
				subject: `Jutro: ${event.title} – pamiętaj o bilecie!`,
				type: TypeMail.ORDER_REMINDER,
				data: {
					buyerName: order.buyerName ?? "Uczestnik",
					eventTitle: event.title,
					eventDate: formattedDate,
					eventLocation,
					eventUrl: `${APP_CONFIG.url}/events/${event.slug}`,
				},
			});

			await prisma.order.update({
				where: { id: order.id },
				data: { reminderSentAt: now },
			});

			sent++;
		} catch (err) {
			console.error(
				"[cron/order-reminder] failed for order",
				order.id,
				err,
			);
			failed++;
		}
	}

	return Response.json({ ok: true, sent, failed, checked: orders.length });
}
