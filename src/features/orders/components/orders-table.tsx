import { Badge } from "@/components/ui/badge";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { OrderActions } from "@/features/orders/components/order-actions";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { OrdersTableFrame } from "@/features/orders/components/orders-table-frame";
import type { OrganizerOrder } from "@/features/orders/types/organizer-order";
import { formatCurrencyPLN } from "@/lib/utils";
import { ReceiptText } from "lucide-react";
import { getTranslations } from "next-intl/server";

type OrdersTableProps = {
	eventId: string;
	orders: OrganizerOrder[];
};

const formatMoney = (amount: number, currency: string) =>
	new Intl.NumberFormat("pl-PL", {
		style: "currency",
		currency,
	}).format(amount / 100);

const formatDate = (date: string) =>
	new Intl.DateTimeFormat("pl-PL", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(date));

export async function OrdersTable({ eventId, orders }: OrdersTableProps) {
	const t = await getTranslations("OrganizerOrders");

	if (orders.length === 0) {
		return (
			<OrdersTableFrame loadingText={t("filters.loading")}>
				<Empty className="border">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<ReceiptText />
						</EmptyMedia>
						<EmptyTitle>{t("empty.title")}</EmptyTitle>
						<EmptyDescription>
							{t("empty.description")}
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			</OrdersTableFrame>
		);
	}

	return (
		<OrdersTableFrame loadingText={t("filters.loading")}>
			<div className="rounded-lg border bg-background">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>{t("table.order")}</TableHead>
							<TableHead>{t("table.buyer")}</TableHead>
							<TableHead>{t("table.tickets")}</TableHead>
							<TableHead>{t("table.total")}</TableHead>
							<TableHead>{t("table.status")}</TableHead>
							<TableHead className="text-right">
								{t("table.actions")}
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{orders.map((order) => (
							<TableRow key={order.id}>
								<TableCell className="min-w-44">
									<div className="font-medium">
										{order.orderNumber ?? order.id}
									</div>
									<div className="text-muted-foreground mt-1 text-xs">
										{formatDate(order.createdAt)}
									</div>
								</TableCell>
								<TableCell className="min-w-56">
									<div className="font-medium">
										{[order.buyerName, order.buyerSurname]
											.filter(Boolean)
											.join(" ") || t("unknownBuyer")}
									</div>
									<div className="text-muted-foreground mt-1 text-xs">
										{order.email}
									</div>
									{order.buyerPhone && (
										<div className="text-muted-foreground text-xs">
											{order.buyerPhone}
										</div>
									)}
								</TableCell>
								<TableCell className="min-w-56">
									<div className="flex flex-wrap gap-1.5">
										{order.tickets.map((ticket) => (
											<Badge
												key={`${order.id}-${ticket.id}`}
												variant="secondary"
											>
												{ticket.name} x{ticket.quantity}
											</Badge>
										))}
									</div>
									<div className="text-muted-foreground mt-2 text-xs">
										{t("participants", {
											count: order.participantsCount,
										})}
									</div>
								</TableCell>
								<TableCell className="font-medium">
									{formatCurrencyPLN(order.total)}
								</TableCell>
								<TableCell>
									<div className="flex flex-col items-start gap-2">
										<OrderStatusBadge
											status={order.status}
										/>
										{order.cancelReason && (
											<div className="text-muted-foreground max-w-56 text-xs whitespace-normal">
												{order.cancelReason}
											</div>
										)}
									</div>
								</TableCell>
								<TableCell className="min-w-72">
									<OrderActions
										eventId={eventId}
										orderId={order.id}
										status={order.status}
									/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</OrdersTableFrame>
	);
}
