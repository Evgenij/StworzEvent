import { EventWizardProgressWrapper } from "@/components/dashboard/events/wizard/event-wizard-progress-wrapper";
import { SIGNIN_ROUTE } from "@/helpers/routes";
import { redirect } from "@/i18n/routing";
import { auth } from "@/lib/auth";
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

	return (
		<div className="flex w-full flex-col gap-6">
			<EventWizardProgressWrapper eventId={id} />
			{children}
		</div>
	);
}
