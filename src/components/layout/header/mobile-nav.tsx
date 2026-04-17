import { cn } from "@/lib/utils";
import React from "react";
import { Portal, PortalBackdrop } from "./ui/portal";
import { XIcon, MenuIcon } from "lucide-react";
import { Button } from "@/components/shadcn/ui/button";
import AuthButtons from "./auth-buttons";
import { NavLink } from "@/types/nav-link";

export function MobileNav({ items }: { items: NavLink[] }) {
	const [open, setOpen] = React.useState(false);

	return (
		<div className="md:hidden">
			<Button
				aria-controls="mobile-menu"
				aria-expanded={open}
				aria-label="Toggle menu"
				className="md:hidden rounded-full"
				onClick={() => setOpen(!open)}
				size="icon"
				variant="ghost"
			>
				{open ? (
					<XIcon className="size-4.5" />
				) : (
					<MenuIcon className="size-4.5" />
				)}
			</Button>
			{open && (
				<Portal className="top-14" id="mobile-menu">
					<PortalBackdrop />
					<div
						className={cn(
							"data-[slot=open]:zoom-in-97 flex flex-col justify-between ease-out data-[slot=open]:animate-in",
							"size-full p-4",
						)}
						data-slot={open ? "open" : "closed"}
					>
						<div className="grid gap-y-2">
							{items.map((link) => (
								<Button
									asChild
									className="justify-start"
									key={link.label}
									variant="ghost"
								>
									<a href={link.href}>{link.label}</a>
								</Button>
							))}
						</div>
						<AuthButtons />
					</div>
				</Portal>
			)}
		</div>
	);
}
