"use client";

import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import { IconChevronLeft } from "@tabler/icons-react";

type ButtonVariants = VariantProps<typeof buttonVariants>;

export function BackButton({
	label = "Wróć",
	variant = "outline",
	size = "xs",
	className,
}: {
	label?: string;
	className?: string;
} & ButtonVariants) {
	const router = useRouter();
	return (
		<Button variant={variant} size={size} className={className} onClick={() => router.back()}>
			<IconChevronLeft className="size-5" />
			{label}
		</Button>
	);
}
