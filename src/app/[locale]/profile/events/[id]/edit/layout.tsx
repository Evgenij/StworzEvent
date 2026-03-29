import { EventWizardProgressWrapper } from "@/components/dashboard/events/wizard/event-wizard-progress-wrapper";
import { EditEventPageHeader } from "@/components/dashboard/events/wizard/edit-event-page-header";
import { EditEventShell } from "@/components/dashboard/events/wizard/edit-event-shell";
import { SIGNIN_ROUTE } from "@/consts/routes";
import { redirect } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { getEventForEdit } from "@/actions/events/get-event-for-edit.action";
import { headers } from "next/headers";

// src/app/[locale]/profile/events/[id]/edit/layout.tsx
type Props = {
	children: React.ReactNode;
	params: Promise<{ locale: string; id: string }>;
};

export default async function EditEventLayout({ children, params }: Props) {
	const { locale, id } = await params;
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		redirect({ href: SIGNIN_ROUTE, locale });
		return null;
	}

	const event = await getEventForEdit(id).catch(() => null);

	const initialPreview = event
		? {
				title: event.title,
				coverImage: event.coverImage ?? "",
				startsAt: event.startsAt.toISOString(),
				endsAt: event.endsAt?.toISOString() ?? "",
				location: event.location ?? "",
				street: event.street,
				streetNumber: event.streetNumber,
			}
		: {};

	return (
		<div className="flex w-full flex-col gap-6">
			{event && <EditEventPageHeader eventTitle={event.title} />}
			<EventWizardProgressWrapper eventId={id} />
			<EditEventShell initialPreview={initialPreview}>
				{children}
			</EditEventShell>
		</div>
	);
}
