"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { IconBrandFacebook } from "@tabler/icons-react";
import { APP_CONFIG } from "@/config/app";
import NavLinks from "../header/nav-links";
import { NavLink } from "@/types/nav-link";
import { MAIN_PAGE_EVENTS_ROUTE } from "@/config/routes";

type FooterWebsiteProps = {
	locale: string;
};

const mainLinks: NavLink[] = [
	{ href: MAIN_PAGE_EVENTS_ROUTE, label: "Wydarzenia" },
	{ href: "#", label: "Kontakt" },
];

const secondaryLinks: NavLink[] = [
	{ href: "#", label: "Regulamin" },
	{ href: "#", label: "Polityka prywatności" },
];

const socialLinks = [
	{
		href: "#",
		label: "X",
		icon: <IconBrandFacebook />,
	},
];

const FooterWebsite = ({ locale }: FooterWebsiteProps) => {
	return (
		<footer className="pb-30 sm:pb-0 px-4 md:px-6 border-t">
			<div className="mx-auto max-w-7xl">
				<div className="flex flex-col gap-6 py-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Link href="/">
								<img
									src="/logos/logo_text.svg"
									alt="logo"
									width={204}
									height={47}
								/>
							</Link>
						</div>
						<div className="flex items-center">
							{socialLinks.map(({ href, label, icon }) => (
								<Button
									asChild
									key={label}
									size="icon-sm"
									variant="ghost"
								>
									<a aria-label={label} href={href}>
										{icon}
									</a>
								</Button>
							))}
						</div>
					</div>

					{/* <nav>
						<ul className="flex flex-wrap gap-4 font-medium text-muted-foreground text-sm md:gap-6">
							{navLinks.map((link) => (
								<li key={link.label}>
									<a
										className="hover:text-foreground"
										href={link.href}
									>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</nav> */}
					<NavLinks items={mainLinks} />
				</div>
				<div className="flex items-center justify-between gap-4 border-t py-4 text-muted-foreground text-sm">
					<p>
						&copy; 2025-{new Date().getFullYear()},{" "}
						{APP_CONFIG.name} v{APP_CONFIG.version}
					</p>

					<div className="flex items-center gap-4">
						{secondaryLinks.map((link) => (
							<Link href={link.href} key={link.label}>
								{link.label}
							</Link>
						))}
					</div>

					{/* <p className="inline-flex items-center gap-1">
						<span>Built by</span>
						<a
							aria-label="x/twitter"
							className="inline-flex items-center gap-1 text-foreground/80 hover:text-foreground hover:underline"
							href={"https://uixer.design"}
							rel="noreferrer"
							target="_blank"
						>
							UIXER
						</a>
					</p> */}
				</div>
			</div>
		</footer>
	);
};

export default FooterWebsite;
