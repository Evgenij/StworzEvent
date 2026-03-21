// src/app/[locale]/profile/events/[id]/edit/additional/page.tsx
import { getEventAdditional } from "@/actions/events/get-event-additional.action";
import { StepAdditional } from "@/components/dashboard/events/wizard/step-additional";

import { notFound } from "next/navigation";

type Props = {
	params: Promise<{ id: string }>;
};

export default async function AdditionalPage({ params }: Props) {
	const { id } = await params;

	try {
		const data = await getEventAdditional(id);
		return <StepAdditional eventId={id} data={data} />;
	} catch {
		notFound();
	}
}
