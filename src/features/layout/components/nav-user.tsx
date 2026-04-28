"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/shadcn/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/shadcn/ui/sidebar";
import { signOutAction } from "@/features/auth/actions/sign-out";
import { Link, useRouter } from "@/i18n/routing";
import {
	ADMIN_DASHBOARD_ROUTE,
	MAIN_PAGE_ROUTE,
	SIGNIN_ROUTE,
} from "@/consts/routes";
import { UserType } from "@/types/user";
import { UserRole } from "@prisma/client";
import {
	IconChevronCompactUp,
	IconClipboardData,
	IconCrown,
	IconInvoice,
	IconLogout,
	IconLogout2,
	IconReceiptDollar,
	IconSelector,
	IconSettings,
	IconSettings2,
	IconSparkles,
	IconSparkles2,
	IconUser,
	IconUserCircle,
} from "@tabler/icons-react";

export function NavUser({ user }: { user: UserType | null }) {
	const { isMobile } = useSidebar();
	const router = useRouter();

	if (!user) return null;

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage
									src={user.image ?? undefined}
									alt={user.name ?? undefined}
								/>
								<AvatarFallback>
									{user.name?.slice(0, 2).toUpperCase() ??
										"UN"}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									{user.name}
								</span>
								<span className="truncate text-xs">
									{user.email}
								</span>
							</div>
							<IconSelector className="ml-auto size-5" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage
										src={user.image ?? undefined}
										alt={user.name ?? undefined}
									/>
									<AvatarFallback>
										{user.name?.slice(0, 2).toUpperCase() ??
											"UN"}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">
										{user.name}
									</span>
									<span className="truncate text-xs">
										{user.email}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<IconCrown />
								Zmien plan subskrypcji
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							{user.role === UserRole.ADMIN && (
								<Link
									href={ADMIN_DASHBOARD_ROUTE}
									className="default"
								>
									<DropdownMenuItem>
										<IconClipboardData />
										Admin panel
									</DropdownMenuItem>
								</Link>
							)}
							<DropdownMenuItem>
								<IconUser />
								Profil
							</DropdownMenuItem>
							<DropdownMenuItem>
								<IconReceiptDollar />
								Transakcje finansowe
							</DropdownMenuItem>
							<DropdownMenuItem>
								<IconSettings />
								Ustawienia
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							variant="destructive"
							onClick={() =>
								signOutAction(() =>
									router.push(MAIN_PAGE_ROUTE),
								)
							}
						>
							<IconLogout />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
