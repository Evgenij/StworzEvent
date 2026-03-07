import { Button } from "@/components/shadcn/ui/button";
import { Separator } from "@/components/shadcn/ui/separator";
import { Typography } from "@/components/shared";
import { Link } from "@/i18n/routing";
import { Organization, Prisma } from "@prisma/client";
import { IconBasket, IconExternalLink, IconTicket } from "@tabler/icons-react";
import React from "react";

type EventSidebarProps = {
	organization: Prisma.OrganizationGetPayload<{
		include: {
			_count: {
				select: { events: true };
			};
		};
	}>;
};

const EventSidebar = ({ organization }: EventSidebarProps) => {
	return (
		<aside className="sticky top-20 rounded-xl overflow-hidden border border-sidebar">
			<header className="bg-sidebar flex items-start justify-between px-4 py-3 text-foreground ">
				<div className="company-info flex items-center gap-3">
					<img
						src={
							organization.logo ||
							"/logos/company_logo_default.svg"
						}
						alt={organization.name}
						className="size-12 rounded-full"
					/>
					<div className="company-data flex flex-col">
						<Typography variant="h4" className="text-base!">
							{organization.name}
						</Typography>
						{/* TODO add link to company page */}
						<span className="text-muted-foreground text-sm">
							{organization._count?.events || 0} wydarzeń
						</span>
					</div>
				</div>
				<Link
					href={organization.website || ""}
					target="_blank"
					rel="noopener noreferrer"
				>
					<IconExternalLink size={20} />
				</Link>
			</header>
			<main className="flex flex-col gap-4 p-4">
				<Separator />
				<Separator />
				<div className="price flex flex-col gap-1">
					<Typography variant="p" className="font-medium">
						Bilety juz od:
					</Typography>
					<div className="price-wrapper flex items-center gap-2">
						<Typography variant="h2" className="text-primary">
							145 zl
						</Typography>
						<Typography
							variant="h4"
							className="text-muted-foreground opacity-50"
						>
							/os
						</Typography>
					</div>
				</div>
				<Button size={"lg"} className="w-full">
					<IconBasket className="size-5" />
					Buy Ticket
				</Button>
			</main>
		</aside>
	);
};

export default EventSidebar;
