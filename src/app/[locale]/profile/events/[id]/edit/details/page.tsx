import { getEventForEdit } from "@/actions/events/get-event-for-edit.action";
import { StepDetails } from "@/components/dashboard/events/wizard/step-details";
import { notFound } from "next/navigation";

type Props = {
	params: Promise<{ id: string }>;
};

export default async function DetailsPage({ params }: Props) {
	const { id } = await params;

	try {
		const event = await getEventForEdit(id);
		return <StepDetails event={event} />;
	} catch {
		notFound();
	}
}
