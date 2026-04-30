"use client";

import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { setOrdersLoading } from "@/features/orders/components/orders-loading-store";
import { usePathname, useRouter } from "@/i18n/routing";
import { OrderStatus } from "@prisma/client";
import { Loader2, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

type OrdersFiltersProps = {
	query: string;
	status: OrderStatus | "ALL";
};

export function OrdersFilters({ query, status }: OrdersFiltersProps) {
	const t = useTranslations("OrganizerOrders");
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();
	const [search, setSearch] = useState(query);
	const [selectedStatus, setSelectedStatus] =
		useState<OrderStatus | "ALL">(status);

	useEffect(() => {
		setSearch(query);
	}, [query]);

	useEffect(() => {
		setSelectedStatus(status);
	}, [status]);

	const updateParams = (updates: Record<string, string | null>) => {
		const params = new URLSearchParams(searchParams.toString());

		Object.entries(updates).forEach(([key, value]) => {
			if (!value) {
				params.delete(key);
				return;
			}

			params.set(key, value);
		});

		const queryString = params.toString();
		const href = queryString ? `${pathname}?${queryString}` : pathname;

		startTransition(() => {
			router.replace(href, { scroll: false });
		});
	};

	useEffect(() => {
		const timeoutId = window.setTimeout(() => {
			const nextQuery = search.trim();
			if (nextQuery === query.trim()) return;

			updateParams({ q: nextQuery || null });
		}, 2000);

		return () => window.clearTimeout(timeoutId);
	}, [search, query]);

	const handleStatusChange = (nextStatus: string) => {
		const nextOrderStatus =
			nextStatus === "ALL" ? "ALL" : (nextStatus as OrderStatus);

		setSelectedStatus(nextOrderStatus);
		updateParams({
			status: nextStatus === "ALL" ? null : nextStatus,
		});
	};

	const isSearchWaiting = search.trim() !== query.trim();
	const isStatusWaiting = selectedStatus !== status;
	const isLoadingOrders = isPending || isSearchWaiting || isStatusWaiting;

	useEffect(() => {
		setOrdersLoading(isLoadingOrders);

		return () => setOrdersLoading(false);
	}, [isLoadingOrders]);

	return (
		<div aria-busy={isLoadingOrders}>
			<div className="flex flex-col gap-3 sm:flex-row">
				<div className="relative min-w-0 flex-1">
					<Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
					<Input
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder={t("filters.searchPlaceholder")}
						className="h-9 pl-9 pr-9"
					/>
					{isSearchWaiting && (
						<Loader2 className="text-muted-foreground absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin" />
					)}
				</div>
				<Select
					value={selectedStatus}
					onValueChange={handleStatusChange}
				>
					<SelectTrigger className="h-9 w-full sm:w-52">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="ALL">{t("filters.all")}</SelectItem>
						{Object.values(OrderStatus).map((orderStatus) => (
							<SelectItem key={orderStatus} value={orderStatus}>
								{t(`statuses.${orderStatus}`)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
