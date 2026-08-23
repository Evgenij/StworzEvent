import { PageHeader } from "@/features/layout";
import { getEventOrdersAction } from "@/features/orders/actions/get-event-orders.action";
import { OrdersFilters } from "@/features/orders/components/orders-filters";
import { OrdersSummary } from "@/features/orders/components/orders-summary";
import { OrdersTable } from "@/features/orders/components/orders-table";
import { BackButton } from "@/shared/components/back-button";
import { OrderStatus } from "@prisma/client";
import { notFound } from "next/navigation";

type Props = {
	params: Promise<{ id: string }>;
	searchParams: Promise<{
		q?: string;
		status?: string;
	}>;
};

const parseStatus = (status?: string): OrderStatus | "ALL" => {
	if (!status || status === "ALL") return "ALL";
	return Object.values(OrderStatus).includes(status as OrderStatus)
		? (status as OrderStatus)
		: "ALL";
};

export default async function EventOrdersPage({ params, searchParams }: Props) {
	const [{ id }, filters] = await Promise.all([params, searchParams]);
	const query = filters.q ?? "";
	const status = parseStatus(filters.status);

	try {
		const data = await getEventOrdersAction({
			eventId: id,
			query,
			status,
		});

		return (
			<div className="space-y-6">
				<div className="flex gap-2 items-center">
					<BackButton />
					<p className="text-sm font-medium">{data.event.title}</p>
				</div>
				<OrdersSummary summary={data.summary} />
				<OrdersFilters query={query} status={status} />
				<OrdersTable eventId={id} orders={data.orders} />
			</div>
		);
	} catch {
		notFound();
	}
}
