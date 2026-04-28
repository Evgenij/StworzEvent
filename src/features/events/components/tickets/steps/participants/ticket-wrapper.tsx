import type { ReactNode } from "react";

export const TicketWrapper = ({
	children,
	id,
}: {
	children: ReactNode;
	id: string;
}) => {
	return (
		<div className="flex rounded-2xl overflow-hidden border-r-2 border-border">
			<div className="flex-1 p-4 border border-r-0 border-border rounded-tl-2xl rounded-bl-2xl">
				{children}
			</div>

			<div className="relative px-5 pr-3 flex flex-col items-center justify-center shrink-0 border border-border border-l-0 rounded-tr-2xl rounded-br-2xl">
				<div className="absolute -top-3 z-10 -left-3 size-6 rounded-full bg-background border border-border" />
				<div className="absolute left-0 top-0 bottom-0 border-l-2 border-dashed " />
				<div className="barcode flex">
					<img src="/images/ticket_barcode.svg" alt="barcode" />
					<span className="text-xs text-center text-muted-foreground [writing-mode:vertical-lr]">
						{id}
					</span>
				</div>

				<div className="absolute -bottom-3 -left-3 size-6 rounded-full bg-background border border-border" />
			</div>
		</div>
	);
};
