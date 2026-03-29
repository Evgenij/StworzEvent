"use client";

import { Link } from "@/i18n/routing";
import { Button } from "@/components/shadcn/ui/button";
import { MAIN_PAGE_ROUTE } from "@/consts/routes";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";
import AuthButtons from "./auth-buttons";
import { UserType } from "@/types/user";

type HeaderWebsiteProps = {
	locale: string;
	user?: UserType;
};

export const navLinks = [
	{
		label: "Wydarzenia",
		href: "#",
	},
	{
		label: "Pricing",
		href: "#",
	},
	{
		label: "About",
		href: "#",
	},
];

const HeaderWebsite = ({ locale, user }: HeaderWebsiteProps) => {
	const scrolled = useScroll(10);

	return (
		<header
			className={cn("sticky top-0 z-50 w-full border-b border-border", {
				"p-4 pb-0 border-transparent": scrolled,
			})}
		>
			<nav
				className={cn(
					"max-w-7xl mx-auto flex h-14 w-full transition-all items-center justify-between px-3 bg-white ",
					{
						"border border-border rounded-full  backdrop-blur-sm supports-backdrop-filter:bg-white/80":
							scrolled,
					},
				)}
			>
				<Link href={MAIN_PAGE_ROUTE} className="ml-3">
					<img
						src="/logos/logo_text.svg"
						alt="logo"
						width={140}
						height={32}
					/>
				</Link>

				<div className="hidden md:flex items-center gap-2">
					{navLinks.map((link) => (
						<Button
							asChild
							key={link.label}
							size="sm"
							variant="ghost"
						>
							<a href={link.href}>{link.label}</a>
						</Button>
					))}
				</div>
				<AuthButtons user={user} className="hidden" />
				<MobileNav />
			</nav>
		</header>
	);
};

export default HeaderWebsite;
