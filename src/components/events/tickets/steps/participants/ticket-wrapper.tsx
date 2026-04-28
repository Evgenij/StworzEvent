import { cn, truncate } from "@/lib/utils";
import type { ReactNode } from "react";

export const TicketWrapper = ({
	children,
	className,
	id,
}: {
	children: ReactNode;
	className?: string;
	id: string;
}) => {
	return (
		<div className="ticket-wrapper flex rounded-2xl overflow-hidden group h-fit">
			<div
				className={cn(
					"ticket-wrapper-content flex-1 p-4 border border-r-0 border-border rounded-tl-2xl rounded-bl-2xl group-hover:border-foreground/30",
					className,
				)}
			>
				{children}
			</div>

			<div className="ticket-wrapper-barcode relative flex shrink-0 items-stretch border border-border border-l-0 rounded-tr-2xl rounded-br-2xl group-hover:border-foreground/30">
				<div className="absolute -top-3 z-10 -left-3 size-6 rounded-full bg-background border border-border group-hover:border-foreground/30" />
				<div className="absolute left-0 top-0 bottom-0 border-l-2 border-dashed" />
				<div className="barcode flex items-center px-3 py-4 gap-1 pl-5">
					<div className="img-wrapper w-10 h-full flex items-center justify-center relative overflow-hidden">
						<img
							src="/images/ticket_barcode.svg"
							alt="barcode"
							className="absolute w-full h-auto"
						/>
					</div>

					<span className="text-xs text-center text-muted-foreground [writing-mode:vertical-lr]">
						{truncate(id, 10)}
					</span>
				</div>
				<div className="absolute -bottom-3 -left-3 size-6 rounded-full bg-background border border-border group-hover:border-foreground/30" />
			</div>
		</div>
	);
};
