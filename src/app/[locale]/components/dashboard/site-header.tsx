"use client";

import { SidebarIcon } from "lucide-react";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/shadcn/ui/breadcrumb";
import { Button } from "@/shadcn/ui/button";
import { Separator } from "@/shadcn/ui/separator";
import { useSidebar } from "@/shadcn/ui/sidebar";
import { IconSearch } from "@tabler/icons-react";
import Breadcrumbs from "../breadcrumbs";

export function SiteHeader() {
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
				<Separator orientation="vertical" className="mr-2 h-4" />
				<div className="flex w-full justify-between items-center">
					<Breadcrumbs />
					<Button>
						<IconSearch />
						Search
					</Button>
				</div>
			</div>
		</header>
	);
}
