import React from "react";
import { TicketWithAvailability } from "@/types/ticket";
import { Button } from "@/components/shadcn/ui/button";
import { IconMinus, IconPlus } from "@tabler/icons-react";

type TicketItemProps = {
	ticket: TicketWithAvailability;
	quantity: number;
	onIncrement: () => void;
	onDecrement: () => void;
	disabled?: boolean; // ← новый проп
};

const TicketItem = ({
	ticket,
	quantity,
	onIncrement,
	onDecrement,
	disabled = false, // ← новый проп
}: TicketItemProps) => {
	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-col ">
				<p className="font-medium">{ticket.name}</p>
				<p className="text-base text-primary font-semibold">
					{ticket.price === 0
						? "Bezpłatny"
						: `${(ticket.price / 100).toFixed(2)} zł`}
				</p>
				{ticket.available !== null && (
					<p className="text-xs text-muted-foreground">
						Dostępnych: {ticket.available}
					</p>
				)}
			</div>

			<div className="flex items-center gap-2">
				<Button
					size="icon"
					variant="outline"
					onClick={onDecrement}
					disabled={quantity === 0 || disabled}
				>
					<IconMinus className="size-4" />
				</Button>
				<span className="w-6 text-center font-semibold">
					{quantity}
				</span>
				<Button
					size="icon"
					variant="outline"
					onClick={onIncrement}
					disabled={
						disabled ||
						(ticket.available !== null
							? quantity >= ticket.available
							: false)
					}
				>
					<IconPlus className="size-4" />
				</Button>
			</div>
		</div>
	);
};

export default TicketItem;
