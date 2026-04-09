// src/app/[locale]/profile/events/[id]/edit/additional/page.tsx
import { getEventAdditionalAction } from "@/actions/events/get-event-additional.action";
import { getEventForEditAction } from "@/actions/events/get-event-for-edit.action";
import { StepAdditional } from "@/components/dashboard/events/wizard/step-additional";

import { notFound } from "next/navigation";

type Props = {
	params: Promise<{ id: string }>;
};

export default async function AdditionalPage({ params }: Props) {
	const { id } = await params;

	try {
		const [data, event] = await Promise.all([
			getEventAdditionalAction(id),
			getEventForEditAction(id),
		]);
		return (
			<StepAdditional
				eventId={id}
				data={data}
				eventStartDate={event.startsAt}
				eventEndDate={event.endsAt ?? undefined}
			/>
		);
	} catch {
		notFound();
	}
}
