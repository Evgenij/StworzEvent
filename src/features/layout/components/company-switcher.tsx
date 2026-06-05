"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronsUpDown, Plus, Trash2 } from "lucide-react";
import {
	IconBuildings,
	IconClipboardText,
	IconDotsVertical,
	IconEdit,
	IconFilePencil,
	IconPlus,
	IconSelect,
	IconSelector,
	IconSparkles,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "@/i18n/routing";
import { NEW_EVENT_ROUTE, NEW_ORGANIZATION_ROUTE } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { deleteOrganizationAction } from "@/features/organizations/actions/delete-organization.action";
import { MY_ORGANIZATIONS_QUERY_KEY } from "@/features/organizations/hooks/use-my-organizations";
import { useActiveOrganization } from "@/features/organizations/context/active-organization-context";

type OrgInfo = {
	id: string;
	name: string;
	logo: string | null;
	slug: string;
};

export function CompanySwitcher({
	organizations,
}: {
	organizations: OrgInfo[];
}) {
	const { isMobile } = useSidebar();
	const queryClient = useQueryClient();
	const router = useRouter();
	const { activeOrganization: active, setActiveOrganization: setActive } =
		useActiveOrganization();
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [, startTransition] = useTransition();

	useEffect(() => {
		if (!active && organizations[0]) {
			setActive(organizations[0]);
		} else if (active && !organizations.find((o) => o.id === active.id)) {
			setActive(organizations[0] ?? null);
		}
	}, [organizations, active]);

	function handleDelete(e: React.MouseEvent, org: OrgInfo) {
		e.stopPropagation();
		setDeletingId(org.id);
		startTransition(async () => {
			const result = await deleteOrganizationAction(org.id);
			if (!result.success) {
				toast.error("Nie udało się usunąć organizacji");
			} else {
				toast.success(`Organizacja "${org.name}" została usunięta`);
				if (active?.id === org.id) {
					const next =
						organizations.find((o) => o.id !== org.id) ?? null;
					setActive(next);
				}
				queryClient.invalidateQueries({
					queryKey: MY_ORGANIZATIONS_QUERY_KEY,
				});
				if (result.data?.isLastOrganization) {
					// Role changed to USER — refresh session cache to reflect new role
					await fetch(
						"/api/auth/get-session?disableCookieCache=true",
						{ credentials: "include" },
					);
					router.refresh();
				}
			}
			setDeletingId(null);
		});
	}

	if (!active) {
		return (
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton size="lg" asChild>
						<Link href={NEW_EVENT_ROUTE}>
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary">
								<IconPlus className="size-4 text-white" />
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									Utwórz wydarzenie
								</span>
								<span className="truncate text-xs text-muted-foreground">
									Zostań organizatorem
								</span>
							</div>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		);
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<div className="bg-black text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
								<IconBuildings className="size-4" />
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									{active.name}
								</span>
								<span className="truncate text-xs">
									Plan - Free
								</span>
							</div>
							<IconSelector />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						align="start"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						<DropdownMenuLabel>Firmy</DropdownMenuLabel>
						{organizations.map((org) => (
							<DropdownMenuItem
								key={org.id}
								onClick={() => setActive(org)}
								className="group pl-2"
							>
								<span className="flex flex-col flex-1 truncate">
									{org.name}
									<span className="truncate text-xs text-muted-foreground">
										Plan - Free
									</span>
								</span>
								<DropdownMenu>
									<DropdownMenuTrigger asChild className="">
										<Button variant="ghost" size="icon-sm">
											<IconDotsVertical className="size-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<DropdownMenuLabel>
											Operacje
										</DropdownMenuLabel>
										<DropdownMenuItem>
											<IconEdit className="size-4" />
											Zmienić dane
										</DropdownMenuItem>
										<DropdownMenuItem>
											<IconSparkles className="size-4" />
											Zmienić plan
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											variant="destructive"
											onClick={(e) =>
												handleDelete(e, org)
											}
											disabled={deletingId === org.id}
										>
											<Trash2 className="size-4" />
											Usunąć firmę
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
								{/* <button
									onClick={(e) => handleDelete(e, org)}
									disabled={deletingId === org.id}
									className="ml-auto shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 focus:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
								>
									<Trash2 className="size-3.5" />
								</button> */}
							</DropdownMenuItem>
						))}
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild className="gap-2 p-2">
							<Link href={NEW_ORGANIZATION_ROUTE}>
								<div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
									<Plus className="size-4" />
								</div>
								<div className="font-medium text-muted-foreground">
									Dodaj firmę
								</div>
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
