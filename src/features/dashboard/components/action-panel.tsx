import { NEW_EVENT_ROUTE } from "@/config/routes";
import { Link } from "@/i18n/routing";
import { IconArrowRight, IconPlus } from "@tabler/icons-react";
import React from "react";

const ActionPanel = () => {
	return (
		<Link href={NEW_EVENT_ROUTE} className="no-underline">
			<div className="dashboard-actions__item text-sm transition-all group hover:-translate-y-0.5 hover:border-primary hover:shadow-xl/10 shadow-primary duration-100 flex flex-col gap-3 border border-border rounded-2xl p-4 bg-background">
				<div className="dashboard-actions__item-header flex justify-between">
					<div className="icon-wrapper p-2 transition-all text-primary bg-primary/10 rounded-lg flex items-center justify-center">
						<IconPlus className="size-5" />
					</div>

					<IconArrowRight className="size-4 group-hover:text-primary group-hover:translate-x-1 transition-all duration-100" />
				</div>

				<div className="dashboard-actions__item-content flex flex-col gap-1">
					<div className="dashboard-actions__item-name font-medium">
						Nowe wydarzenie
					</div>
					<div className="dashboard-actions__item-description text-muted-foreground text-xs">
						Kreator w 3 krokach
					</div>
				</div>
			</div>
		</Link>
	);
};

export default ActionPanel;
