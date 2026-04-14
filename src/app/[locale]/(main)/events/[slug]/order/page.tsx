// app/[locale]/(main)/events/[slug]/order/page.tsx
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import prisma from "@/lib/prisma";
import { getActiveReservation } from "@/actions/reservations/get-active-reservation.action";
import { OrderForm } from "./order-form";
import { Typography } from "@/components/shared";

type OrderPageProps = {
	params: Promise<{ slug: string; locale: string }>;
	searchParams: Promise<{
		reservationId?: string;
		orderId?: string;
		total?: number;
		completed?: boolean;
	}>;
};

const OrderPage = async ({ params, searchParams }: OrderPageProps) => {
	const { slug } = await params;
	const { reservationId, orderId, total, completed } = await searchParams;

	// Находим мероприятие
	const event = await prisma.event.findUnique({
		where: { slug },
	});

	if (!event) redirect(`/events`);

	let reservation = null;

	if (completed) {
		return (
			<div className="px-4 py-8">
				<OrderForm
					reservation={null}
					eventId={event.id}
					eventSlug={slug}
					isCompleted={true} // ← новый проп
				/>
			</div>
		);
	}

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

		console.log(reservation);
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
		<section className="order-page flex flex-col flex-1 max-w-5xl gap-6">
			<div className="py-4 bg-muted rounded-2xl">
				<Typography>Zamawianie biletów</Typography>
			</div>

			<OrderForm
				reservation={reservation}
				eventId={event.id}
				eventSlug={slug}
			/>
		</section>
	);
};

export default OrderPage;
