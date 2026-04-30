import { redirect } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { getMyOrganizations } from "@/features/organizations/actions/get-my-organizations.action";
import { OrganizationsList } from "@/features/organizations/components/organizations-list";
import { PageHeader } from "@/features/layout";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { NEW_ORGANIZATION_ROUTE, SIGNIN_ROUTE } from "@/config/routes";
import { IconPlus } from "@tabler/icons-react";

export default async function OrganizationsPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		redirect({ href: SIGNIN_ROUTE, locale });
		return null;
	}

	const [organizations, t] = await Promise.all([
		getMyOrganizations(),
		getTranslations("Organizations"),
	]);

	return (
		<>
			<div className="flex items-center justify-between gap-4">
				<PageHeader />
				<Button asChild size="sm">
					<Link href={NEW_ORGANIZATION_ROUTE}>
						<IconPlus className="size-3.5" />
						{t("actions.new")}
					</Link>
				</Button>
			</div>

			<OrganizationsList organizations={organizations} />
		</>
	);
}
