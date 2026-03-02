"use client";

import { SidebarIcon } from "lucide-react";

import { Button } from "@/components/shadcn/ui/button";
import { Separator } from "@/components/shadcn/ui/separator";
import { useSidebar } from "@/components/shadcn/ui/sidebar";
import { IconBellRinging, IconPlus } from "@tabler/icons-react";
import Breadcrumbs from "../../../components/shared/breadcrumbs";
import { Badge } from "@/components/shadcn/ui/badge";

export default function SiteHeader() {
	const { toggleSidebar } = useSidebar();

	return (
		<header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
			<div className="flex h-(--header-height) w-full items-center gap-2 px-4">
				<Button
					className="h-8 w-8"
					variant="ghost"
					size="icon"
					onClick={toggleSidebar}
				>
					<SidebarIcon />
				</Button>
				<Separator orientation="vertical" className="mr-2 h-14" />
				<div className="flex w-full justify-between items-center">
					<Breadcrumbs />
					<div className="flex gap-2">
						<div className="relative">
							<Button variant="outline" size="icon">
								<IconBellRinging />
								<Badge
									variant="destructive"
									className="absolute -top-2 -right-2"
								>
									3
								</Badge>
							</Button>
						</div>

						<Button>
							<IconPlus />
							Nowe wydarzenie
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
}
