// app/[locale]/(main)/events/[slug]/order/order-form.tsx
"use client";

import { Prisma } from "@prisma/client";
import { useEffect, useState } from "react";
import { OrderForm as OrderFormType } from "@/features/events/components/tickets/tickets-drawer";
import { useSession } from "@/lib/auth-client";
import { StepParticipants } from "@/features/events/components/tickets/steps/participants/step-participants";
import { StepOrderSummary } from "@/features/events/components/tickets/steps/confirmation/step-order-summary";
import { StepOrderSuccess } from "@/features/events/components/tickets/steps/confirmation/step-order-success";

type ReservationWithItems = Prisma.TicketReservationGetPayload<{
	include: {
		items: {
			include: { ticket: true };
		};
	};
}>;

type OrderFormProps = {
	reservation: ReservationWithItems | null;
	eventId: string;
	eventSlug: string;
	completedOrderId?: string;
	completedTotal?: number;
	isCompleted?: boolean;
};

export const OrderForm = ({
	reservation,
	eventId,
	eventSlug,
	isCompleted = false,
}: OrderFormProps) => {
	const [step, setStep] = useState<"participants" | "summary" | "success">(
		isCompleted ? "success" : "participants",
	);
	const [orderId, setOrderId] = useState<string>("");
	const [orderTotal, setOrderTotal] = useState<number>(0);
	const [orderForm, setOrderForm] = useState<OrderFormType | null>(null);

	const [buyerData, setBuyerData] = useState<{
		email: string;
		name: string;
		surname: string;
	} | null>(null);

	const { data: session } = useSession();

	const ticketItems =
		reservation?.items.map((item) => ({
			ticket: { ...item.ticket, available: null },
			quantity: item.quantity,
		})) ?? [];

	useEffect(() => {
		if (isCompleted) {
			const saved = sessionStorage.getItem(`order_success_${eventSlug}`);
			if (saved) {
				const data = JSON.parse(saved);
				setOrderId(data.orderId);
				setOrderTotal(data.total);
				setBuyerData(data.buyer);
				setStep("success");
			}
		}
	}, [isCompleted]);

	const handleSuccess = (id: string, total: number) => {
		const successData = {
			orderId: id,
			total,
			buyer: {
				email: orderForm!.buyer.email,
				name: orderForm!.buyer.name,
				surname: orderForm!.buyer.surname,
			},
		};

		// Сохраняем в sessionStorage
		sessionStorage.setItem(
			`order_success_${eventSlug}`,
			JSON.stringify(successData),
		);

		setOrderId(id);
		setOrderTotal(total);
		setBuyerData(successData.buyer);
		setStep("success");
		window.history.replaceState(null, "", `?completed=1`);
	};

	return (
		<>
			{step === "participants" && reservation && (
				<StepParticipants
					items={ticketItems}
					expiresAt={reservation.expiresAt}
					onBack={() => window.history.back()}
					onNext={(form) => {
						setOrderForm(form);
						setStep("summary");
					}}
				/>
			)}

			{step === "summary" && orderForm && (
				<StepOrderSummary
					items={ticketItems}
					orderForm={orderForm}
					eventId={eventId}
					reservationId={reservation?.id ?? ""}
					onBack={() => setStep("participants")}
					onSuccess={handleSuccess}
				/>
			)}

			{step === "success" && (
				<StepOrderSuccess
					orderId={orderId}
					orderTotal={orderTotal}
					eventSlug={eventSlug}
					isLoggedIn={!!session}
					buyerData={buyerData}
				/>
			)}
		</>
	);
};
