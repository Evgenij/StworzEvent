"use client";

import { CreateEventForm } from "@/components/dashboard/events/create-event-form";
import { CreateOrganizationForm } from "@/components/dashboard/organizations/create-organization-form";
import { Typography } from "@/components/shared";
import { IconBuildingSkyscraper } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import {
	useMyOrganizations,
	MY_ORGANIZATIONS_QUERY_KEY,
} from "@/hooks/use-my-organizations";

export default function NewEventPage() {
	const t = useTranslations("CreateOrganization");
	const queryClient = useQueryClient();
	const { data: organizations = [], isLoading } = useMyOrganizations();

	if (isLoading) return <div>Sprawdzamy czy jestes orgizatorem...</div>;

	if (organizations.length === 0) {
		return (
			<div className="z-10 w-sm 2xl:w-lg mx-auto flex flex-col gap-7 py-5">
				<header className="flex items-start gap-3">
					<div className="rounded-lg bg-muted p-2.5 mt-0.5 shrink-0">
						<IconBuildingSkyscraper className="size-5 text-muted-foreground" />
					</div>
					<div>
						<Typography variant="h2">{t("noOrgTitle")}</Typography>
						<p className="text-sm text-muted-foreground mt-1">
							{t("noOrgDescription")}
						</p>
					</div>
				</header>

				<CreateOrganizationForm
					onSuccess={() =>
						queryClient.invalidateQueries({
							queryKey: MY_ORGANIZATIONS_QUERY_KEY,
						})
					}
				/>
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
