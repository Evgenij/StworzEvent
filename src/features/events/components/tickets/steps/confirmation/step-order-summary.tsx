"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IconArrowLeft } from "@tabler/icons-react";
import { SelectedTicket, OrderForm } from "../../tickets-drawer";
import { formatGroszeToPLN } from "@/lib/utils";
import { createOrder } from "@/features/orders/actions/create-order.action";

type StepOrderSummaryProps = {
	items: SelectedTicket[];
	orderForm: OrderForm;
	eventId: string;
	reservationId: string;
	onBack: () => void;
	onSuccess: (orderId: string, total: number) => void;
};

export const StepOrderSummary = ({
	items,
	orderForm,
	eventId,
	reservationId,
	onBack,
	onSuccess,
}: StepOrderSummaryProps) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const total = items.reduce(
		(sum, item) => sum + item.ticket.price * item.quantity,
		0,
	);

	const handleConfirm = async () => {
		setLoading(true);
		setError(null);
		try {
			const order = await createOrder({
				eventId,
				reservationId,
				email: orderForm.buyer.email,
				buyerName: orderForm.buyer.name,
				buyerSurname: orderForm.buyer.surname,
				buyerPhone: orderForm.buyer.phone,
				items: items.map((item) => ({
					ticketId: item.ticket.id,
					quantity: item.quantity,
				})),
				participants: orderForm.participants,
			});

			onSuccess(order.id, total);
		} catch (e) {
			setError("Nie udało się złożyć zamówienia. Spróbuj ponownie.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="step-order-summary flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<p className="font-semibold">Zamawiający</p>
				<p className="text-sm">
					{orderForm.buyer.name} {orderForm.buyer.surname}
				</p>
				<p className="text-sm text-muted-foreground">
					{orderForm.buyer.email}
				</p>
				{orderForm.buyer.phone && (
					<p className="text-sm text-muted-foreground">
						{orderForm.buyer.phone}
					</p>
				)}
			</div>

			<Separator />

			<div className="flex flex-col gap-2">
				<p className="font-semibold">Bilety</p>
				{items.map((item) => (
					<div
						key={item.ticket.id}
						className="flex justify-between text-sm"
					>
						<span>
							{item.ticket.name} × {item.quantity}
						</span>
						<span className="font-medium">
							{item.ticket.price === 0
								? "Bezpłatny"
								: formatGroszeToPLN(
										item.ticket.price * item.quantity,
									)}
						</span>
					</div>
				))}
			</div>

			<Separator />

			<div className="flex justify-between font-bold">
				<span>Razem</span>
				<span>
					{total === 0 ? "Bezpłatne" : formatGroszeToPLN(total)}
				</span>
			</div>

			{error && (
				<p className="text-sm text-destructive text-center">{error}</p>
			)}

			<div className="flex gap-3">
				<Button variant="outline" onClick={onBack} className="flex-1">
					<IconArrowLeft className="size-4" />
					Wróć
				</Button>
				<Button
					onClick={handleConfirm}
					disabled={loading}
					className="flex-1"
				>
					{loading ? "Składanie..." : "Potwierdź zamówienie"}
				</Button>
			</div>
		</div>
	);
};
