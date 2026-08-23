"use client";

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import React from "react";

const WrapperFutureFunction = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<span
					className={cn(
						"flex-1 flex cursor-not-allowed opacity-50",
						className,
					)}
				>
					<span className="pointer-events-none flex-1 flex">
						{children}
					</span>
				</span>
			</TooltipTrigger>
			<TooltipContent>
				<p>Ta funkcja jest w budowaniu</p>
			</TooltipContent>
		</Tooltip>
	);
};

export default WrapperFutureFunction;
