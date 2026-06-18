"use client";

import { Progress } from "@/components/ui/progress";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { EventWithCategories } from "@/types/event";

type Props = {
	tickets: EventWithCategories["tickets"];
};

const EventSalesStats = ({ tickets }: Props) => {
	if (tickets.length === 0) {
		return (
			<span className="text-xs text-muted-foreground">Brak biletów</span>
		);
	}

	const ticketStats = tickets.map((t) => ({
		name: t.name,
		sold: t.orderItems.reduce((s, oi) => s + oi.quantity, 0),
		capacity: t.quantity,
	}));

	const soldCount = ticketStats.reduce((sum, t) => sum + t.sold, 0);
	const hasUnlimited = tickets.some((t) => t.quantity === null);
	const totalCapacity = hasUnlimited
		? null
		: tickets.reduce((sum, t) => sum + (t.quantity ?? 0), 0);
	const percent =
		totalCapacity !== null && totalCapacity > 0
			? Math.min(100, Math.round((soldCount / totalCapacity) * 100))
			: null;

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<div className="ticket-sales-stats min-w-[100px] cursor-default">
					<div className="flex justify-between items-baseline mb-1 gap-2">
						<div
							className={cn(
								"counts text-muted-foreground gap-0.5 flex items-baseline",
								{ "flex-col gap-0": totalCapacity === null },
							)}
						>
							<span className="font-semibold text-foreground">
								{soldCount}
							</span>
							{totalCapacity !== null ? (
								<>
									<span className="text-xs">/</span>
									<span className="text-xs">{totalCapacity}</span>
								</>
							) : (
								<span className="text-xs">sprzedanych</span>
							)}
						</div>
						{percent !== null && (
							<span className="text-xs font-medium">{percent}%</span>
						)}
					</div>
					{percent !== null && (
						<Progress value={percent} className="h-1.5" />
					)}
				</div>
			</TooltipTrigger>
			<TooltipContent side="top" className="p-2.5 min-w-[180px]">
				<div className="flex flex-col gap-1.5">
					{ticketStats.map((t, i) => (
						<div
							key={i}
							className="flex justify-between items-center gap-4"
						>
							<span className="opacity-75 truncate max-w-[130px]">
								{t.name}
							</span>
							<span className="font-medium shrink-0">
								{t.sold}
								{t.capacity !== null ? (
									<span className="opacity-60 font-normal">
										{" "}
										/ {t.capacity}
									</span>
								) : (
									<span className="opacity-60 font-normal"> ∞</span>
								)}
							</span>
						</div>
					))}
				</div>
			</TooltipContent>
		</Tooltip>
	);
};

export default EventSalesStats;
