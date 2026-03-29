"use client";

import { CreateEventForm } from "@/components/dashboard/events/create-event-form";
import { EVENT_EDIT_ADDITIONAL_ROUTE } from "@/consts/routes";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { use } from "react";

type Props = {
	params: Promise<{ id: string }>;
};

export default function EditEventPage({ params }: Props) {
	const { id } = use(params);
	const router = useRouter();
	const locale = useLocale();

	return (
		<CreateEventForm
			eventId={id}
			onSuccess={() =>
				router.push(`/${locale}${EVENT_EDIT_ADDITIONAL_ROUTE(id)}`)
			}
		/>
	);
}
