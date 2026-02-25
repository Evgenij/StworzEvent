"use client";

import { ReactNode } from "react";

type Variant = "h1" | "h2" | "h3" | "h4" | "p";

const variantStyles: Record<Variant, string> = {
	h1: "scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance",
	h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
	h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
	h4: "scroll-m-20 text-xl font-semibold tracking-tight",
	p: "leading-7 [&:not(:first-child)]:mt-6",
};

export function Typography({
	children,
	className = "",
	variant = "h1",
}: {
	children: ReactNode;
	className?: string;
	variant?: Variant;
}) {
	const Component = variant;

	return (
		<Component className={`${variantStyles[variant]} ${className}`}>
			{children}
		</Component>
	);
}
