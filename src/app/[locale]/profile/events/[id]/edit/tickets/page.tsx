import { getEventTickets } from "@/actions/tickets/get-event-tickets.action";
import { StepTickets } from "@/components/dashboard/events/wizard/step-tickets";
import { notFound } from "next/navigation";

type Props = {
	params: Promise<{ id: string }>;
};

export default async function TicketsPage({ params }: Props) {
	const { id } = await params;

	try {
		const tickets = await getEventTickets(id);
		return <StepTickets eventId={id} initialTickets={tickets} />;
	} catch {
		notFound();
	}
}
