"use client";

import React from "react";
import NavLinks from "./nav-links";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/shadcn/ui/button";
import { IconLogin, IconUser, IconUserPlus } from "@tabler/icons-react";
import { SIGNIN_ROUTE, SIGNUP_ROUTE } from "@/helpers/routes";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";

type HeaderWebsiteProps = {
	locale: string;
};

export const navLinks = [
	{
		label: "Features",
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

const HeaderWebsite = ({ locale }: HeaderWebsiteProps) => {
	const scrolled = useScroll(10);

	return (
		<header
			className={cn(
				"sticky top-0 z-50 w-full border-transparent border-b",
				{
					"border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50":
						scrolled,
				},
			)}
		>
			<nav className="container mx-auto flex h-14 w-full items-center justify-between px-4">
				<Link href="/">
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

				<div className="hidden items-center gap-2 md:flex">
					<Button size="sm" variant="outline" asChild>
						<Link href={SIGNIN_ROUTE}>Sign In</Link>
					</Button>
					<Button size="sm" asChild>
						<Link href={SIGNUP_ROUTE}>Get Started</Link>
					</Button>
				</div>
				<MobileNav />
			</nav>
		</header>
	);
};

export default HeaderWebsite;
