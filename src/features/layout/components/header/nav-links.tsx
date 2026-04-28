import { Button } from "@/components/shadcn/ui/button";
import { Link } from "@/i18n/routing";
import React from "react";

const NavLinks = ({ items }: { items: { label: string; href: string }[] }) => {
	return (
		<nav className="flex gap-1">
			{items.map((link) => (
				<Button
					asChild
					key={link.label}
					size="sm"
					className="rounded-full"
					variant="ghost"
				>
					<Link href={link.href}>{link.label}</Link>
				</Button>
			))}
		</nav>
	);
};

export default NavLinks;
