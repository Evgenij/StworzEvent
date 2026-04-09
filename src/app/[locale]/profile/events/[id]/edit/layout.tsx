import { EventWizardProgressWrapper } from "@/components/dashboard/events/wizard/event-wizard-progress-wrapper";
import { EditEventPageHeader } from "@/components/dashboard/events/wizard/edit-event-page-header";
import { EditEventShell } from "@/components/dashboard/events/wizard/edit-event-shell";
import { SIGNIN_ROUTE } from "@/consts/routes";
import { redirect } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { getEventForEditAction } from "@/actions/events/get-event-for-edit.action";
import { headers } from "next/headers";
import { Separator } from "@/components/shadcn/ui/separator";

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

	const event = await getEventForEditAction(id).catch(() => null);

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
		<div className="edit-event-layout flex w-full flex-col gap-4">
			{event && <EditEventPageHeader eventTitle={event.title} />}
			<Separator />
			<EventWizardProgressWrapper eventId={id} />
			<EditEventShell initialPreview={initialPreview}>
				{children}
			</EditEventShell>
		</div>
	);
}
