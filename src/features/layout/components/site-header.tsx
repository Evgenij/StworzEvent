"use client";

import { SidebarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { IconBellRinging, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { NEW_EVENT_ROUTE } from "@/config/routes";
import FutureFunctionWrapper from "./wrapper-future-function";
import Breadcrumbs from "@/shared/components/breadcrumbs";

export default function SiteHeader() {
	const { toggleSidebar } = useSidebar();

	return (
		<header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
			<div className="flex h-(--header-height) w-full items-center gap-2 px-3">
				<Button
					className="h-8 w-8"
					variant="ghost"
					size="icon"
					onClick={toggleSidebar}
				>
					<SidebarIcon />
				</Button>
				<Separator orientation="vertical" className="mr-2 h-14" />
				<div className="flex w-full justify-end md:justify-between items-center">
					<Breadcrumbs className="hidden md:flex" />
					<div className="flex gap-2">
						<FutureFunctionWrapper>
							<div className="relative">
								<Button variant="outline" size="icon" disabled>
									<IconBellRinging />
									{/* <Badge
										variant="destructive"
										className="absolute -top-2 -right-2"
									>
										3
									</Badge> */}
								</Button>
							</div>
						</FutureFunctionWrapper>

						<Button asChild>
							<Link href={NEW_EVENT_ROUTE}>
								<IconPlus />
								Nowe wydarzenie
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
}
