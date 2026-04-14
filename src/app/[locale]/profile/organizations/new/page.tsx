import { CreateOrganizationForm } from "@/components/dashboard/organizations/create-organization-form";
import { Typography } from "@/components/shared";
import { getTranslations } from "next-intl/server";
import { IconBuildingSkyscraper } from "@tabler/icons-react";

export default async function NewOrganizationPage() {
	const t = await getTranslations("CreateOrganization");

	return (
		<div className="relative z-10 w-sm 2xl:w-lg mx-auto flex flex-col gap-7 py-5">
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
