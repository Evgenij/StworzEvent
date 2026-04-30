import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@prisma/client";
import { useTranslations } from "next-intl";

const statusClassName: Record<OrderStatus, string> = {
	[OrderStatus.PENDING]:
		"border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300",
	[OrderStatus.CONFIRMED]:
		"border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300",
	[OrderStatus.PAID]:
		"border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-300",
	[OrderStatus.CANCELLED]:
		"border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300",
	[OrderStatus.EXPIRED]:
		"border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-300",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
	const t = useTranslations("OrganizerOrders.statuses");

	return (
		<Badge variant="outline" className={statusClassName[status]}>
			{t(status)}
		</Badge>
	);
}
