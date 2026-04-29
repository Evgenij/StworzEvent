import { EditEventPageHeader } from "@/components/dashboard/events/wizard/edit-event-page-header";
import { SIGNIN_ROUTE } from "@/config/routes";
import { redirect } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { getEventForEditAction } from "@/actions/events/get-event-for-edit.action";
import { headers } from "next/headers";
import { Separator } from "@/components/ui/separator";

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

	return (
		<div className="edit-event-layout flex w-full flex-col gap-4">
			{event && <EditEventPageHeader eventTitle={event.title} />}
			<Separator />
			{children}
		</div>
	);
}
