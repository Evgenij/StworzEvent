import { getMyOrganizations } from "@/actions/organizations/get-my-organizations.action";
import { CreateEventForm } from "@/components/dashboard/events/create-event-form";
import { CreateOrganizationForm } from "@/components/dashboard/organizations/create-organization-form";
import { Typography } from "@/components/shared";
import { getTranslations } from "next-intl/server";
import { IconBuildingSkyscraper } from "@tabler/icons-react";

export default async function NewEventPage() {
	const [organizations, t] = await Promise.all([
		getMyOrganizations(),
		getTranslations("CreateOrganization"),
	]);

	const hasOrganization = organizations.length > 0;

	if (!hasOrganization) {
		return (
			<div className="z-10 w-sm 2xl:w-lg mx-auto flex flex-col gap-7 py-5">
				<header className="flex items-start gap-3">
					<div className="rounded-lg bg-muted p-2.5 mt-0.5 shrink-0">
						<IconBuildingSkyscraper className="size-5 text-muted-foreground" />
					</div>
					<div>
						<Typography variant="h2">{t("newOrgTitle")}</Typography>
						<p className="text-sm text-muted-foreground mt-1">
							{t("newOrgDescription")}
						</p>
					</div>
				</header>

				<CreateOrganizationForm />
			</div>
		);
	}

	return (
		<div className="new-event-page z-10 w-sm 2xl:w-lg mx-auto flex flex-col gap-7 py-5">
			<header className="flex items-start gap-1">
				<div className="mt-1">✨</div>
				<div>
					<Typography variant="h2">Nowe wydarzenie</Typography>
					<span className="text-sm text-muted-foreground">
						Tylko najważniejsze – resztę dodasz później
					</span>
				</div>
			</header>

			<CreateEventForm />
		</div>
	);
}
