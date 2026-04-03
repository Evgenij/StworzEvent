"use client";

import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/shadcn/ui/button";
import { Separator } from "@/components/shadcn/ui/separator";
import { IconClock, IconChevronRight, IconMapPin } from "@tabler/icons-react";
import TicketItem from "./ticket-item";
import { SelectedTicket } from "../../tickets-drawer";
import { formatPlnFromGrosze } from "@/lib/utils";

type StepSelectTicketsProps = {
	items: SelectedTicket[];
	setItems: Dispatch<SetStateAction<SelectedTicket[]>>;
	eventTitle: string;
	eventDate: string;
	eventLocation: {
		city: string | null;
		address: string | null;
	};
	onNext: () => void;
	loading?: boolean;
	hasActiveReservation?: boolean;
	onCancelReservation?: () => void;
	cancelLoading?: boolean;
};

export const StepSelectTickets = ({
	items,
	setItems,
	eventTitle,
	eventDate,
	eventLocation,
	onNext,
	loading = false,
	hasActiveReservation = false,
	onCancelReservation,
	cancelLoading = false,
}: StepSelectTicketsProps) => {
	const updateQuantity = (ticketId: string, delta: number) => {
		setItems((prev) =>
			prev.map((item) =>
				item.ticket.id === ticketId
					? { ...item, quantity: Math.max(0, item.quantity + delta) }
					: item,
			),
		);
	};

	const total = items.reduce(
		(sum, item) => sum + item.ticket.price * item.quantity,
		0,
	);
	const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
	const locationLabel = [eventLocation.city, eventLocation.address]
		.filter(Boolean)
		.join(", ");

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col bg-muted rounded-lg p-3">
				<p className="font-semibold text-base line-clamp-3">
					{eventTitle}
				</p>
				<p className="text-sm text-muted-foreground capitalize">
					{eventDate}
				</p>
				{locationLabel && (
					<div className="event-location flex items-center gap-1 pt-2">
						<IconMapPin className="size-4" />
						<p className="text-sm ">{locationLabel}</p>
					</div>
				)}
			</div>

			<Separator />

			<div className="flex flex-col gap-3">
				{[...items]
					.sort((a, b) => a.ticket.price - b.ticket.price)
					.map(({ ticket, quantity }) => (
						<TicketItem
							key={ticket.id}
							ticket={ticket}
							quantity={quantity}
							onIncrement={() => updateQuantity(ticket.id, 1)}
							onDecrement={() => updateQuantity(ticket.id, -1)}
							disabled={hasActiveReservation}
						/>
					))}
			</div>

			<Separator />

			{totalItems > 0 && (
				<>
					<div className="flex items-center justify-between">
						<p className="text-muted-foreground">
							Razem ({totalItems}{" "}
							{totalItems === 1 ? "bilet" : "bilety"}
							):
						</p>
						<p className="text-xl font-bold">
							{total === 0
								? "Bezpłatne"
								: formatPlnFromGrosze(total)}
						</p>
					</div>
					<div className="bg-muted rounded-lg p-3 text-sm text-muted-foreground">
						<p className="font-medium text-base text-foreground mb-1">
							Jak zapłacić?
						</p>
						<p>
							Po złożeniu zamówienia otrzymasz numer zamówienia.
						</p>
						<p>Prześlij potwierdzenie przelewu organizatorowi.</p>
					</div>
				</>
			)}

			{hasActiveReservation && (
				<div className="flex flex-col gap-2 bg-primary/10 text-primary rounded-lg px-3 py-2 text-sm">
					<div className="flex items-center gap-2">
						<IconClock className="size-5 shrink-0" />
						<span className="font-medium">
							Masz aktywną rezerwację — możesz kontynuować
							zamówienie
						</span>
					</div>
					<Button
						size="default"
						variant="link"
						className="text-sm underline text-left text-primary/70 hover:text-primary"
						onClick={onCancelReservation}
					>
						{cancelLoading
							? "Anulowanie..."
							: "Zmień zamówienie (anuluje rezerwację)"}
					</Button>
				</div>
			)}

			<Button
				size="lg"
				className="w-full"
				disabled={totalItems === 0 || loading}
				onClick={onNext}
			>
				{loading
					? "Ładowanie..."
					: hasActiveReservation
						? "Kontynuuj"
						: "Dalej"}
				<IconChevronRight className="size-4" />
			</Button>
		</div>
	);
};
