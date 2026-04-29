"use client";

import { IconBuildingSkyscraper, IconLoader } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import {
	MY_ORGANIZATIONS_QUERY_KEY,
	useMyOrganizations,
} from "@/features/organizations/hooks/use-my-organizations";
import { Typography } from "@/shared/components";
import { CreateOrganizationForm } from "@/features/organizations/components/create-organization-form";
import { CreateEventForm } from "@/features/events/components/editor/create-event-form";

export default function NewEventPage() {
	const t = useTranslations("CreateOrganization");
	const queryClient = useQueryClient();
	const { data: organizations = [], isLoading } = useMyOrganizations();

	if (isLoading)
		return (
			<div className="h-[700px] flex items-center justify-center flex-col">
				<img src="/images/boy.svg" alt="boy" />
				<div className="flex items-center gap-2">
					<IconLoader className="size-6 animate-spin" />
					<Typography variant="h4">
						Sprawdzamy czy jestes orgizatorem...
					</Typography>
				</div>
			</div>
		);

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
