import { EditEventPageHeader } from "@/components/dashboard/events/wizard/edit-event-page-header";
import { SIGNIN_ROUTE } from "@/consts/routes";
import { redirect } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { getEventForEditAction } from "@/actions/events/get-event-for-edit.action";
import { headers } from "next/headers";
import { Separator } from "@/components/shadcn/ui/separator";
import { BackButton } from "@/components/shared/back-button";
import { Typography } from "@/components/shared";

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
			<header className="flex items-center gap-3">
				<BackButton />

				{event && (
					<Typography variant="h2" className="line-clamp-1">
						{event.title}
					</Typography>
				)}
			</header>

			<Separator />
			{children}
		</div>
	);
}
