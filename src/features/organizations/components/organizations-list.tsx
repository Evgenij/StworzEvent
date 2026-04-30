"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import { Link } from "@/i18n/routing";
import { ORGANIZATION_ROUTE } from "@/config/routes";
import { MyOrganization } from "../actions/get-my-organizations.action";
import { MemberRole } from "@prisma/client";
import { useTranslations } from "next-intl";
import { IconBuilding, IconPencil } from "@tabler/icons-react";

type BadgeVariant = "default" | "secondary" | "outline";

const ROLE_VARIANT: Record<MemberRole, BadgeVariant> = {
	[MemberRole.OWNER]: "default",
	[MemberRole.MANAGER]: "secondary",
	[MemberRole.FINANCE]: "secondary",
	[MemberRole.STAFF]: "outline",
	[MemberRole.VIEWER]: "outline",
	[MemberRole.SUPPORT]: "outline",
	[MemberRole.MARKETING]: "outline",
	[MemberRole.API_CLIENT]: "outline",
};

type Props = {
	organizations: MyOrganization[];
};

export function OrganizationsList({ organizations }: Props) {
	const t = useTranslations("Organizations");

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>{t("columns.organization")}</TableHead>
					<TableHead>{t("columns.nip")}</TableHead>
					<TableHead>{t("columns.legalForm")}</TableHead>
					<TableHead>{t("columns.role")}</TableHead>
					<TableHead />
				</TableRow>
			</TableHeader>
			<TableBody>
				{organizations.length === 0 ? (
					<TableRow>
						<TableCell
							colSpan={5}
							className="py-10 text-center text-muted-foreground"
						>
							{t("empty")}
						</TableCell>
					</TableRow>
				) : (
					organizations.map(({ memberRole, organizations: org }) => (
						<TableRow key={org.id}>
							<TableCell>
								<div className="flex items-center gap-3">
									<Avatar size="sm">
										<AvatarImage
											src={org.logo ?? undefined}
											alt={org.name}
										/>
										<AvatarFallback>
											<IconBuilding className="size-3.5" />
										</AvatarFallback>
									</Avatar>
									<span className="font-medium">{org.name}</span>
								</div>
							</TableCell>
							<TableCell className="text-muted-foreground">
								{org.nip ?? "—"}
							</TableCell>
							<TableCell className="text-muted-foreground">
								{org.legalForm
									? t(`legalForms.${org.legalForm}` as any)
									: "—"}
							</TableCell>
							<TableCell>
								<Badge variant={ROLE_VARIANT[memberRole]}>
									{t(`roles.${memberRole}` as any)}
								</Badge>
							</TableCell>
							<TableCell className="text-right">
								<Button variant="outline" size="sm" asChild>
									<Link href={ORGANIZATION_ROUTE(org.id)}>
										<IconPencil className="size-3.5" />
										{t("actions.edit")}
									</Link>
								</Button>
							</TableCell>
						</TableRow>
					))
				)}
			</TableBody>
		</Table>
	);
}
