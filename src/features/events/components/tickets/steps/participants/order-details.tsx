import { Typography } from "@/shared/components";
import { IconTicket } from "@tabler/icons-react";
import { SelectedTicket } from "../../tickets-drawer";
import { Separator } from "@/components/ui/separator";
import { cn, formatGroszeToPLN } from "@/lib/utils";

type OrderDetailsProps = {
	items: SelectedTicket[];
	total: number;
	className?: string;
};

const OrderDetails = ({ items, total, className }: OrderDetailsProps) => {
	return (
		<div className={cn(className, "flex flex-col gap-3")}>
			<Typography
				variant="h4"
				className="flex items-center gap-2 text-base!"
			>
				<IconTicket />
				Twoje zamówienie
			</Typography>
			<div className="tickets flex flex-col gap-2">
				<div className="tickets-list flex flex-col gap-1">
					{items.map((item) => (
						<div
							key={item.ticket.id}
							className="flex justify-between text-sm text-muted-foreground"
						>
							<span>
								{item.ticket.name} × {item.quantity}
							</span>
							<span className="font-medium text-foreground">
								{item.ticket.price === 0
									? "Bezpłatny"
									: formatGroszeToPLN(
											item.ticket.price * item.quantity,
										)}
							</span>
						</div>
					))}
				</div>
				<Separator />
				<div className="flex justify-between font-semibold text-sm">
					<span>Razem</span>
					<span>
						{total === 0 ? "Bezpłatne" : formatGroszeToPLN(total)}
					</span>
				</div>
			</div>
		</div>
	);
};

export default OrderDetails;
