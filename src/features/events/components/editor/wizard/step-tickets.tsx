"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { type EventTicket } from "@/features/tickets/actions/get-event-tickets.action";
import {
	TicketCard,
	type LocalTicket,
} from "@/components/dashboard/events/tickets/ticket-card";
import EmptySection from "../sections/empty-section";
import { useCreateEventPreview } from "../create-event-context";

type Props = {
	eventId: string;
	initialTickets: EventTicket[];
};

export function StepTickets({ eventId, initialTickets }: Props) {
	const t = useTranslations("EventWizard.tickets");
	const { setMinPrice } = useCreateEventPreview();

	const [tickets, setTickets] = useState<LocalTicket[]>(initialTickets);

	useEffect(() => {
		if (tickets.length === 0) {
			setMinPrice(null);
		} else {
			const min = Math.min(...tickets.map((t) => t.price));
			setMinPrice(min * 100); // PLN → grosze
		}
	}, [tickets]);

	const handleAdd = () => {
		const tempId = `temp-${Date.now()}`;
		setTickets((prev) => [
			...prev,
			{
				id: tempId,
				name: "",
				description: null,
				price: 0,
				quantity: 100,
			},
		]);
	};

	const handleDelete = (id: string) => {
		setTickets((prev) => prev.filter((t) => t.id !== id));
	};

	const handleSave = (oldId: string, updated: LocalTicket) => {
		setTickets((prev) => prev.map((t) => (t.id === oldId ? updated : t)));
	};

	return (
		<div className="flex flex-col gap-3 items-start">
			{tickets.length === 0 && <EmptySection>{t("empty")}</EmptySection>}

			{tickets.length > 0 && (
				<div className="tikets-list flex flex-col gap-2 w-full">
					{tickets.map((ticket, index) => (
						<TicketCard
							key={ticket.id}
							ticket={ticket}
							index={index}
							eventId={eventId}
							onDelete={handleDelete}
							onSave={handleSave}
						/>
					))}
				</div>
			)}

			<Button
				type="button"
				variant="outline"
				onClick={handleAdd}
				className="w-full"
			>
				<IconPlus className="size-4" />
				{t("addTicket")}
			</Button>
		</div>
	);
}
