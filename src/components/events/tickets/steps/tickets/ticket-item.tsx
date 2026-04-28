import { TicketWithAvailability } from "@/types/ticket";
import { Button } from "@/components/shadcn/ui/button";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { formatPlnFromGrosze } from "@/lib/utils";

type TicketItemProps = {
	ticket: TicketWithAvailability;
	quantity: number;
	onIncrement: () => void;
	onDecrement: () => void;
	disabled?: boolean;
};

const TicketItem = ({
	ticket,
	quantity,
	onIncrement,
	onDecrement,
	disabled = false,
}: TicketItemProps) => {
	const reachedAvailability =
		ticket.available !== null ? quantity >= ticket.available : false;

	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-col ">
				<p className="font-medium">{ticket.name}</p>
				{ticket.description && (
					<p className="text-sm text-muted-foreground">{ticket.description}</p>
				)}
				<p className="text-base text-primary font-semibold">
					{ticket.price === 0
						? "Bezpłatny"
						: formatPlnFromGrosze(ticket.price)}
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
					disabled={disabled || reachedAvailability}
				>
					<IconPlus className="size-4" />
				</Button>
			</div>
		</div>
	);
};

export default TicketItem;
