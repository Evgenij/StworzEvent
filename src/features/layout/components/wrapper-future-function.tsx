import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/shadcn/ui/tooltip";
import React from "react";

const FutureFunctionWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<span className="flex-1 flex cursor-not-allowed">
					<span className="pointer-events-none flex-1 flex">{children}</span>
				</span>
			</TooltipTrigger>
			<TooltipContent>
				<p>
					Ta funkcja jest w budowaniu. Bedzie dostepna w nastepnej
					wersji.
				</p>
			</TooltipContent>
		</Tooltip>
	);
};

export default FutureFunctionWrapper;
