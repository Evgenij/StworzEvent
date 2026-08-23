import type { OrganizerOrdersSummary } from "@/features/orders/types/organizer-order";
import { formatCurrencyPLN } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

type OrdersSummaryProps = {
	summary: OrganizerOrdersSummary;
};

export async function OrdersSummary({ summary }: OrdersSummaryProps) {
	const t = await getTranslations("OrganizerOrders.summary");

	const items = [
		{
			label: t("total"),
			value: summary.total,
			color: "text-muted-foreground",
		},
		{ label: t("pending"), value: summary.pending, color: "text-primary" },
		{
			label: t("confirmed"),
			value: summary.confirmed + summary.paid,
			color: "text-success",
		},
		{
			label: t("cancelled"),
			value: summary.cancelled,
			color: "text-destructive",
		},
		{
			label: t("revenue"),
			value: formatCurrencyPLN(summary.revenue),
			color: "text-muted-foreground",
		},
	];

	return (
		<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
			{items.map((item) => (
				<div
					key={item.label}
					className={`rounded-lg border bg-background px-4 py-3`}
				>
					<div className={`text-xs font-medium ${item.color}`}>
						{item.label}
					</div>
					<div className="mt-1 text-xl font-semibold">
						{item.value}
					</div>
				</div>
			))}
		</div>
	);
}
