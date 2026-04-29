import { getEventAdditionalAction } from "@/features/events/actions/get-event-additional.action";
import { getEventForEditAction } from "@/features/events/actions/get-event-for-edit.action";
import { EditEventTabs } from "@/features/events/components/editor/edit-event-tabs";
import { getEventTickets } from "@/features/tickets/actions/get-event-tickets.action";
import { notFound } from "next/navigation";

type Props = {
	params: Promise<{ id: string }>;
};

export default async function EditEventPage({ params }: Props) {
	const { id } = await params;

	try {
		const [event, additionalData, tickets] = await Promise.all([
			getEventForEditAction(id),
			getEventAdditionalAction(id),
			getEventTickets(id),
		]);

		return (
			<EditEventTabs
				eventId={id}
				initialAdditionalData={additionalData}
				initialTickets={tickets}
				initialPreview={{
					title: event.title,
					coverImage: event.coverImage ?? "",
					startsAt: event.startsAt.toISOString(),
					endsAt: event.endsAt?.toISOString() ?? "",
					location: event.location ?? "",
					street: event.street ?? undefined,
					streetNumber: event.streetNumber ?? undefined,
				}}
				eventStartDate={event.startsAt}
				eventEndDate={event.endsAt ?? undefined}
			/>
		);
	} catch (error) {
		console.log(error);

		notFound();
	}
}
