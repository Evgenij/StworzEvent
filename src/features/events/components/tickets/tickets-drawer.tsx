// tickets-drawer.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { StepSelectTickets } from "./steps/tickets/step-select-tickets";
import { DateTimeFormatter } from "@/helpers/date";
import { TicketWithAvailability } from "../../types/ticket";
import { getActiveReservation } from "@/features/reservations/actions/get-active-reservation.action";
import { createReservation } from "@/features/reservations/actions/create-reservation.action";
import { cancelReservation } from "@/features/reservations/actions/cancel-reservation.action";
import { getTicketsWithAvailability } from "@/features/tickets/actions/get-tickets-with-availability.action";

export type SelectedTicket = {
	ticket: TicketWithAvailability;
	quantity: number;
};

export type ParticipantForm = {
	name: string;
	surname: string;
	email: string;
	phone?: string;
};

export type OrderForm = {
	buyer: ParticipantForm;
	buyerIsParticipant: boolean;
	participants: {
		ticketId: string;
		ticketName: string;
		items: ParticipantForm[];
	}[];
};

type TicketsDrawerProps = {
	locale: string;
	open: boolean;
	onClose: () => void;
	tickets: TicketWithAvailability[];
	eventId: string;
	eventSlug: string;
	eventTitle: string;
	eventDate: Date;
	eventLocation: {
		city: string | null;
		address: string | null;
	};
};

export const TicketsDrawer = ({
	locale,
	open,
	onClose,
	tickets,
	eventId,
	eventSlug,
	eventTitle,
	eventDate,
	eventLocation,
}: TicketsDrawerProps) => {
	const router = useRouter();

	const [items, setItems] = useState<SelectedTicket[]>(
		tickets.map((t) => ({ ticket: t, quantity: 0 })),
	);
	const [loading, setLoading] = useState(false);
	const [cancelLoading, setCancelLoading] = useState(false);

	// Состояние активной резервации
	const [activeReservationId, setActiveReservationId] = useState<
		string | null
	>(null);
	const [checkingReservation, setCheckingReservation] = useState(false);

	const startWeekday = DateTimeFormatter.weekday(eventDate, locale);
	const startDate = DateTimeFormatter.date(eventDate, locale);

	// При открытии Drawer — проверяем есть ли активная резервация
	useEffect(() => {
		if (!open) return;

		const check = async () => {
			setCheckingReservation(true);

			try {
				const reservation = await getActiveReservation(eventId);
				if (reservation) {
					setActiveReservationId(reservation.id);
					// Восстанавливаем количество билетов из резервации
					setItems((prev) =>
						prev.map((item) => {
							const reservedItem = reservation.items.find(
								(ri) => ri.ticketId === item.ticket.id,
							);
							return reservedItem
								? { ...item, quantity: reservedItem.quantity }
								: item;
						}),
					);
				}
			} finally {
				setCheckingReservation(false);
			}
		};

		check();
	}, [open, eventId]);

	const handleNext = async () => {
		setLoading(true);
		try {
			let reservationId = activeReservationId;

			// Если нет активной резервации — создаём новую
			if (!reservationId) {
				const reservation = await createReservation({
					eventId,
					items: items
						.filter((i) => i.quantity > 0)
						.map((i) => ({
							ticketId: i.ticket.id,
							quantity: i.quantity,
						})),
				});
				reservationId = reservation.id;
			}

			router.push(
				`/events/${eventSlug}/order?reservationId=${reservationId}`,
			);
			onClose();
		} catch (error) {
			console.error(error);
			// TODO: toast с ошибкой
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		onClose();
		setTimeout(() => {
			setItems(tickets.map((t) => ({ ticket: t, quantity: 0 })));
			setActiveReservationId(null);
		}, 300);
	};

	const handleCancelReservation = async () => {
		setCancelLoading(true);
		try {
			const result = await cancelReservation(eventId);
			if (!result.success) return;
			setActiveReservationId(null);
			const updated = await getTicketsWithAvailability(eventId);
			setItems(updated.map((t) => ({ ticket: t, quantity: 0 })));
		} finally {
			setCancelLoading(false);
		}
	};

	return (
		<Drawer open={open} onClose={handleClose} direction="right">
			<DrawerContent className="max-h-screen">
				<DrawerHeader>
					<DrawerTitle>Wybierz bilety</DrawerTitle>
				</DrawerHeader>

				<div className="overflow-y-auto px-4 pb-4">
					<StepSelectTickets
						items={items}
						setItems={setItems}
						eventTitle={eventTitle}
						eventDate={`${startWeekday}, ${startDate}`}
						eventLocation={{
							city: eventLocation.city,
							address: eventLocation.address,
						}}
						onNext={handleNext}
						loading={loading || checkingReservation}
						hasActiveReservation={!!activeReservationId}
						onCancelReservation={handleCancelReservation}
					/>
				</div>
			</DrawerContent>
		</Drawer>
	);
};
