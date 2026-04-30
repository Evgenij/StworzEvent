import type { OrganizerOrdersSummary } from "@/features/orders/types/organizer-order";
import { getTranslations } from "next-intl/server";

type OrdersSummaryProps = {
	summary: OrganizerOrdersSummary;
};

const formatMoney = (amount: number) =>
	new Intl.NumberFormat("pl-PL", {
		style: "currency",
		currency: "PLN",
	}).format(amount / 100);

export async function OrdersSummary({ summary }: OrdersSummaryProps) {
	const t = await getTranslations("OrganizerOrders.summary");

	const items = [
		{ label: t("total"), value: summary.total },
		{ label: t("pending"), value: summary.pending },
		{ label: t("confirmed"), value: summary.confirmed + summary.paid },
		{ label: t("cancelled"), value: summary.cancelled },
		{ label: t("revenue"), value: formatMoney(summary.revenue) },
	];

	return (
		<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
			{items.map((item) => (
				<div
					key={item.label}
					className="rounded-lg border bg-background px-4 py-3"
				>
					<div className="text-muted-foreground text-xs">
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
