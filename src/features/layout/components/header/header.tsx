"use client";

import { Link } from "@/i18n/routing";
import { MAIN_PAGE_EVENTS_ROUTE, MAIN_PAGE_ROUTE } from "@/config/routes";
import { cn } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";
import AuthButtons from "./auth-buttons";
import { UserType } from "@/features/user/types/user";
import NavLinks from "./nav-links";
import { NavLink } from "@/types/nav-link";
import { useScroll } from "@/shared/hooks/use-scroll";

type HeaderWebsiteProps = {
	locale: string;
	user?: UserType;
};

const navLinks: NavLink[] = [
	{ label: "Wydarzenia", href: MAIN_PAGE_EVENTS_ROUTE },
];

const HeaderWebsite = ({ locale, user }: HeaderWebsiteProps) => {
	const scrolled = useScroll(10);

	return (
		<header
			className={cn("sticky top-0 z-50 w-full border-b border-border", {
				"md:p-4 pb-0 p-2 md:pt-0 border-transparent": scrolled,
			})}
		>
			<nav
				className={cn(
					"max-w-7xl mx-auto flex h-14 w-full transition-all items-center justify-between px-3 bg-white ",
					{
						"border border-border rounded-b-3xl ": scrolled,
					},
					// {
					// 	"border border-border rounded-full  backdrop-blur-sm supports-backdrop-filter:bg-white/90":
					// 		scrolled,
					// },
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
					<NavLinks items={navLinks} />
					{/* {navLinks.map((link) => (
						<Button
							asChild
							key={link.label}
							size="sm"
							className="rounded-full"
							variant="ghost"
						>
							<a href={link.href}>{link.label}</a>
						</Button>
					))} */}
				</div>

				<AuthButtons user={user} className="hidden md:flex" />
				<MobileNav items={navLinks} />
			</nav>
		</header>
	);
};

export default HeaderWebsite;
