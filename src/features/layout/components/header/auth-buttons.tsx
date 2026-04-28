"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/shadcn/ui/avatar";
import { Button } from "@/components/shadcn/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu";
import { signOutAction } from "@/features/auth/actions/sign-out";
import {
	DASHBOARD_ROUTE,
	MAIN_PAGE_ROUTE,
	NEW_EVENT_ROUTE,
	SIGNIN_ROUTE,
	SIGNUP_ROUTE,
} from "@/consts/routes";
import { Link, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { UserType } from "@/types/user";
import {
	IconChevronDown,
	IconLayoutDashboard,
	IconLogout,
	IconLogout2,
	IconPlus,
	IconRocket,
	IconSettings2,
	IconUserPlus,
} from "@tabler/icons-react";
import { UserRole } from "@prisma/client";

type AuthButtonsProps = {
	user?: UserType | null;
	className?: string;
};

const AuthButtons = ({ user, className }: AuthButtonsProps) => {
	const router = useRouter();

	const handleSignOut = () => {
		signOutAction(() => router.refresh());
	};

	if (user) {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<div className="flex gap-1 items-center p-1 sm:pl-4 hover:bg-muted cursor-pointer rounded-full">
						<div className="name hidden sm:block text-sm font-medium pr-1">
							<p>
								{user.name?.split(" ")[0] || "User"}{" "}
								{user.surname?.split(" ")[0] || "User"}
							</p>
						</div>
						<Avatar>
							<AvatarImage
								src={user.image || undefined}
								alt="user icon"
							/>
							<AvatarFallback className="bg-primary text-white border-none">
								{user.name
									?.split(" ")[0]
									.charAt(0)
									.toUpperCase() || "SE"}
							</AvatarFallback>
						</Avatar>
						{/* <IconChevronDown className="size-5 text-muted-foreground" /> */}
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					{user.role === UserRole.ORGANIZER && (
						<>
							<DropdownMenuItem asChild>
								<Link
									href={NEW_EVENT_ROUTE}
									className="flex items-center gap-1 cursor-pointer px-2 py-1 "
								>
									<IconPlus className="size-5" />
									Create Event
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
						</>
					)}

					<DropdownMenuGroup>
						<DropdownMenuItem asChild>
							<Link
								href={DASHBOARD_ROUTE}
								className="flex items-center gap-1 cursor-pointer px-2 py-1 "
							>
								<IconLayoutDashboard className="size-5" />
								Panel glowny
							</Link>
						</DropdownMenuItem>
						{/* <DropdownMenuItem>
							<IconSettings2 className="size-5" /> Ustawienia
						</DropdownMenuItem> */}
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						variant="destructive"
						onClick={handleSignOut}
					>
						<IconLogout2 className="size-5" />
						Sign Out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	}

	return (
		<div
			className={cn(
				"items-center gap-1 flex flex-col md:flex-row",
				className,
			)}
		>
			<Button
				asChild
				variant="ghost"
				className="rounded-full w-full md:w-fit"
			>
				<Link href={SIGNUP_ROUTE}>
					{/* <IconUserPlus className="size-5" /> */}
					Zarejestruj się
				</Link>
			</Button>
			<Button asChild className="rounded-full w-full md:w-fit">
				<Link href={SIGNIN_ROUTE}>Zaloguj się</Link>
			</Button>
		</div>
	);
};

export default AuthButtons;
