"use client";

import { DASHBOARD_ROUTE } from "@/config/routes";
import { CreateOrganizationForm } from "@/features/organizations/components/forms/create-organization-form";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default async function NewOrganizationPage() {
	const t = useTranslations("CreateOrganization");

	const router = useRouter();

	const handlerSuccess = () => {
		router.push(DASHBOARD_ROUTE);
	};

	return (
		<div className="relative z-10 w-sm 2xl:w-lg mx-auto flex flex-col gap-7 py-5">
			{/* <header className="flex items-start gap-3">
				<div className="rounded-lg bg-muted p-2.5 mt-0.5 shrink-0">
					<IconBuildingSkyscraper className="size-5 text-muted-foreground" />
				</div>
				<div>
					<Typography variant="h2">{t("newOrgTitle")}</Typography>
					<p className="text-sm text-muted-foreground mt-1">
						{t("newOrgDescription")}
					</p>
				</div>
			</header> */}

			<CreateOrganizationForm
				header={{
					title: t("newOrgTitle"),
					subTitle: t("newOrgDescription"),
				}}
				onSuccess={handlerSuccess}
			/>
		</div>
	);
}
