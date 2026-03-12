// app/[locale]/(main)/events/[slug]/order/order-form.tsx
"use client";

import { Prisma } from "@prisma/client";
import { StepParticipants } from "@/components/events/tickets/steps/step-participants";
import { StepConfirmation } from "@/components/events/tickets/steps/step-confirmation";
import { useState } from "react";
import { OrderForm as OrderFormType } from "@/components/events/tickets/tickets-drawer";
import { useSession } from "@/lib/auth-client";

type ReservationWithItems = Prisma.TicketReservationGetPayload<{
	include: {
		items: {
			include: { ticket: true };
		};
	};
}>;

type OrderFormProps = {
	reservation: ReservationWithItems;
	eventId: string;
	eventSlug: string;
};

export const OrderForm = ({
	reservation,
	eventId,
	eventSlug,
}: OrderFormProps) => {
	const [step, setStep] = useState<"participants" | "confirmation">(
		"participants",
	);
	const [orderForm, setOrderForm] = useState<OrderFormType | null>(null);
	const [orderId, setOrderId] = useState<string | null>(null);

	const { data: session } = useSession();

	// Преобразуем items резервации в формат TicketItem
	const ticketItems = reservation.items.map((item) => ({
		ticket: {
			...item.ticket,
			available: null, // резервация уже создана — лимит не важен
		},
		quantity: item.quantity,
	}));

	return (
		<>
			{step === "participants" && (
				<StepParticipants
					items={ticketItems}
					expiresAt={reservation.expiresAt}
					onBack={() => window.history.back()}
					onNext={(form) => {
						setOrderForm(form);
						setStep("confirmation");
					}}
				/>
			)}

			{step === "confirmation" && orderForm && (
				<StepConfirmation
					items={ticketItems}
					orderForm={orderForm}
					eventId={eventId}
					eventSlug={eventSlug}
					reservationId={reservation.id}
					orderId={orderId}
					isLoggedIn={!!session}
					buyerEmail={orderForm.buyer.email}
					onBack={() => setStep("participants")}
					onSuccess={(id) => setOrderId(id)}
				/>
			)}
		</>
	);
};
