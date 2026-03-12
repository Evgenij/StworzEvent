// app/[locale]/(main)/events/[slug]/order/page.tsx
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import prisma from "@/lib/prisma";
import { getActiveReservation } from "@/actions/reservations/get-active-reservation.action";
import { OrderForm } from "./order-form";

type OrderPageProps = {
	params: Promise<{ slug: string; locale: string }>;
	searchParams: Promise<{ reservationId?: string }>;
};

const OrderPage = async ({ params, searchParams }: OrderPageProps) => {
	const { slug } = await params;
	const { reservationId } = await searchParams;

	// Находим мероприятие
	const event = await prisma.event.findUnique({
		where: { slug },
	});

	if (!event) redirect(`/events`);

	let reservation = null;

	if (reservationId) {
		// Загружаем резервацию по ID из URL
		reservation = await prisma.ticketReservation.findUnique({
			where: { id: reservationId },
			include: {
				items: {
					include: { ticket: true },
				},
			},
		});
	} else {
		// Пытаемся восстановить по сессии
		reservation = await getActiveReservation(event.id);

		if (reservation) {
			redirect(`/events/${slug}/order?reservationId=${reservation.id}`);
		}
	}

	// Резервация не найдена или истекла
	if (!reservation || reservation.expiresAt < new Date()) {
		redirect(`/events/${slug}`);
	}

	return (
		<div className="max-w-6xl mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">Zamawianie biletów</h1>
			<OrderForm
				reservation={reservation}
				eventId={event.id}
				eventSlug={slug}
			/>
		</div>
	);
};

export default OrderPage;
