"use client";

import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { AppIcon } from "@/types/icon";

type BaseProps = {
	label: string;
	icon: AppIcon;
};

type LinkProps = BaseProps & {
	href: string;
	onClick?: never;
};

type ButtonProps = BaseProps & {
	onClick: () => void;
	href?: never;
};

export type MobileMenuItemProps = LinkProps | ButtonProps;

export default function MobileMenuItem({
	label,
	icon: Icon,
	href,
	onClick,
}: MobileMenuItemProps) {
	const pathname = usePathname();
	const isActive = href ? pathname === href : false;

	const content = (
		<>
			<Icon className={cn("size-6")} />
			{isActive && (
				<span className={cn("text-sm font-medium text-foreground")}>
					{label}
				</span>
			)}
		</>
	);

	if (onClick) {
		return (
			<button
				onClick={onClick}
				className="flex flex-1 flex-col items-center justify-center gap-1 py-2"
			>
				{content}
			</button>
		);
	}

	return (
		<Link
			href={href}
			className={cn(
				"flex flex-1 items-center justify-center gap-1 py-2 h-10 rounded-full",
				isActive && "bg-black/10",
			)}
		>
			{content}
		</Link>
	);
}
