"use client";

import { useOrdersLoading } from "@/features/orders/components/orders-loading-store";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

type OrdersTableFrameProps = {
	children: ReactNode;
	loadingText: string;
};

export function OrdersTableFrame({
	children,
	loadingText,
}: OrdersTableFrameProps) {
	const isLoading = useOrdersLoading();

	return (
		<div className="relative" aria-busy={isLoading}>
			<div
				className={
					isLoading
						? "pointer-events-none opacity-50 transition-opacity"
						: "transition-opacity"
				}
			>
				{children}
			</div>
			{isLoading && (
				<div className="absolute inset-0 z-10 flex min-h-40 items-center justify-center rounded-lg bg-background/60 backdrop-blur-[1px]">
					<div
						className="bg-background text-foreground flex items-center gap-2 rounded-lg border px-3 py-2 text-sm shadow-sm"
						aria-live="polite"
					>
						<Loader2 className="size-4 animate-spin" />
						{loadingText}
					</div>
				</div>
			)}
		</div>
	);
}
