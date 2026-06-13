"use client";

import { Field } from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { IconSearch } from "@tabler/icons-react";
import { useState, useMemo, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxValue,
} from "@/components/ui/combobox";
import { EventStatus } from "@prisma/client";
import { CalendarRange } from "@/components/ui/calendar-range";
import { type DateRange } from "react-day-picker";
import { useTranslations } from "next-intl";
import { useScroll } from "@/shared/hooks/use-scroll";
import { useSearchParams, useRouter } from "next/navigation";
import { DateTimeFormatter } from "@/helpers/date";

type Status = {
	label: string;
	value: EventStatus;
};

const EventsListSearch = ({
	className,
	onSetFilters,
}: {
	className?: string;
	onSetFilters: (filters: {
		searchText: string;
		statuses: EventStatus[];
		dateRange: DateRange | undefined;
	}) => void;
}) => {
	const scrolled = useScroll(100, undefined, ".profile-layout");
	const router = useRouter();
	const searchParams = useSearchParams();
	const t = useTranslations("EventStatus");

	const listStatuses = useMemo<Status[]>(
		() => [
			{ label: t(EventStatus.DRAFT), value: EventStatus.DRAFT },
			{
				label: t(EventStatus.UNPUBLISHED),
				value: EventStatus.UNPUBLISHED,
			},
			{ label: t(EventStatus.PUBLISHED), value: EventStatus.PUBLISHED },
			{ label: t(EventStatus.SALES_OPEN), value: EventStatus.SALES_OPEN },
			{
				label: t(EventStatus.SALES_PAUSED),
				value: EventStatus.SALES_PAUSED,
			},
			{
				label: t(EventStatus.SALES_CLOSED),
				value: EventStatus.SALES_CLOSED,
			},
			{ label: t(EventStatus.LIVE), value: EventStatus.LIVE },
			{ label: t(EventStatus.COMPLETED), value: EventStatus.COMPLETED },
			{ label: t(EventStatus.CANCELLED), value: EventStatus.CANCELLED },
			{ label: t(EventStatus.ARCHIVED), value: EventStatus.ARCHIVED },
		],
		[t],
	);

	// Инициализируем состояние из URL-параметров (работает при перезагрузке)
	const [searchText, setSearchText] = useState(
		() => searchParams.get("search") ?? "",
	);

	const [statuses, setStatuses] = useState<Status[]>(() => {
		const values = searchParams.getAll("status") as EventStatus[];
		return listStatuses.filter((s) => values.includes(s.value));
	});

	const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
		const from = searchParams.get("from");
		const to = searchParams.get("to");

		console.log(from, to);

		if (!from && !to) return undefined;

		return {
			from: from ? DateTimeFormatter.parseLocalDate(from) : undefined,
			to: to ? DateTimeFormatter.parseLocalDate(to) : undefined,
		};
	});

	// Дебаунс — обновляет URL и уведомляет родителя через 1 сек после последнего изменения
	const flushFilters = useDebouncedCallback(
		(patch: {
			search: string;
			status: EventStatus[];
			from?: Date;
			to?: Date;
			dateRange: DateRange | undefined;
		}) => {
			const params = new URLSearchParams(searchParams.toString());

			if (patch.search) params.set("search", patch.search);
			else params.delete("search");

			params.delete("status");
			patch.status.forEach((s) => params.append("status", s));

			if (patch.from)
				params.set(
					"from",
					DateTimeFormatter.toLocalDateString(patch.from),
				);
			else params.delete("from");

			if (patch.to)
				params.set("to", DateTimeFormatter.toLocalDateString(patch.to));
			else params.delete("to");

			router.replace(`?${params.toString()}`, { scroll: false });

			onSetFilters({
				searchText: patch.search,
				statuses: patch.status,
				dateRange: patch.dateRange,
			});
		},
		1000,
	);

	const handleSearchChange = (value: string) => {
		setSearchText(value);
		flushFilters({
			search: value,
			status: statuses.map((s) => s.value),
			dateRange,
		});
	};

	const handleStatusChange = (items: Status[]) => {
		setStatuses(items);
		flushFilters({
			search: searchText,
			status: items.map((s) => s.value),
			dateRange,
		});
	};

	const handleDateRangeChange = (range: DateRange | undefined) => {
		setDateRange(range);
		flushFilters({
			search: searchText,
			status: statuses.map((s) => s.value),
			from: range?.from,
			to: range?.to,
			dateRange: range,
		});
	};

	// Применяем фильтры при первом монтировании (на случай значений из URL)
	useEffect(() => {
		onSetFilters({
			searchText,
			statuses: statuses.map((s) => s.value),
			dateRange,
		});
	}, []);

	return (
		<div
			className={cn(
				"events-list-search flex flex-col gap-3",
				{
					"bg-white sticky -top-4 left-0 right-0 z-10 p-2 border-b border-r border-l border-border":
						scrolled,
				},
				className,
			)}
		>
			<div className="search-input-section flex gap-2">
				<Field className="w-1/2">
					<InputGroup>
						<InputGroupAddon>
							<IconSearch />
						</InputGroupAddon>
						<InputGroupInput
							placeholder="Wpisz nazwę wydarzenia"
							value={searchText}
							onChange={(e) => handleSearchChange(e.target.value)}
						/>
						<InputGroupAddon align="inline-end">
							<InputGroupButton
								variant="default"
								onClick={() => {
									flushFilters({
										search: searchText,
										status: statuses.map((s) => s.value),
										dateRange,
									});
									flushFilters.flush();
								}}
							>
								<IconSearch />
								Szukaj
							</InputGroupButton>
						</InputGroupAddon>
					</InputGroup>
				</Field>
				<div className="filters flex gap-2 w-1/2">
					<Field>
						<Combobox
							items={listStatuses}
							multiple
							value={statuses}
							onValueChange={handleStatusChange}
						>
							<ComboboxChips>
								<ComboboxValue>
									{statuses.length >= 3 ? (
										<>
											<ComboboxChip
												key={statuses[0].value}
											>
												{statuses[0].label}
											</ComboboxChip>
											<ComboboxChip showRemove={false}>
												+ jeszcze {statuses.length - 1}
											</ComboboxChip>
										</>
									) : (
										statuses.map((item) => (
											<ComboboxChip key={item.value}>
												{item.label}
											</ComboboxChip>
										))
									)}
								</ComboboxValue>
								<ComboboxChipsInput placeholder="Status" />
							</ComboboxChips>
							<ComboboxContent>
								<ComboboxEmpty>No items found.</ComboboxEmpty>
								<ComboboxList>
									{(item) => (
										<ComboboxItem
											key={item.value}
											value={item}
										>
											{item.label}
										</ComboboxItem>
									)}
								</ComboboxList>
							</ComboboxContent>
						</Combobox>
					</Field>
					<Field>
						<CalendarRange
							value={dateRange}
							onChange={handleDateRangeChange}
						/>
					</Field>
				</div>
			</div>
		</div>
	);
};

export default EventsListSearch;
