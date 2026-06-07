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
import { useState, useMemo } from "react";
import EventsListStatuses from "./events-list-statuses";
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

type Status = {
	label: string;
	value: EventStatus;
};

const EventsListSearch = ({ className }: { className?: string }) => {
	const scrolled = useScroll(100, undefined, ".profile-layout");

	const t = useTranslations("EventStatus");
	const [statuses, setStatuses] = useState<Status[]>([]);
	const today = new Date(
		new Date().getFullYear(),
		new Date().getMonth(),
		new Date().getDate(),
	);
	const [dateRange, setDateRange] = useState<DateRange | undefined>({
		from: today,
		to: new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate() + 7,
		),
	});

	const listStatuses = useMemo<Status[]>(
		() => [
			{ label: t(EventStatus.DRAFT), value: EventStatus.DRAFT },
			{
				label: t(EventStatus.PUBLISHED),
				value: EventStatus.PUBLISHED,
			},
			{
				label: t(EventStatus.SALES_OPEN),
				value: EventStatus.SALES_OPEN,
			},
			{
				label: t(EventStatus.SALES_PAUSED),
				value: EventStatus.SALES_PAUSED,
			},
			{
				label: t(EventStatus.SALES_CLOSED),
				value: EventStatus.SALES_CLOSED,
			},
			{
				label: t(EventStatus.LIVE),
				value: EventStatus.LIVE,
			},
			{
				label: t(EventStatus.COMPLETED),
				value: EventStatus.COMPLETED,
			},
			{
				label: t(EventStatus.CANCELLED),
				value: EventStatus.CANCELLED,
			},
			{
				label: t(EventStatus.ARCHIVED),
				value: EventStatus.ARCHIVED,
			},
			{
				label: t(EventStatus.UNPUBLISHED),
				value: EventStatus.UNPUBLISHED,
			},
		],
		[t],
	);

	return (
		<div
			className={cn(
				// "events-list-search flex flex-col gap-3 p-2 border border-border rounded-2xl bg-background",
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
						<InputGroupInput placeholder="Wpisz nazwę wydarzenia"></InputGroupInput>
						<InputGroupAddon align="inline-end">
							<InputGroupButton variant="default">
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
							onValueChange={setStatuses}
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
								<ComboboxChipsInput placeholder="Ustaw status" />
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
							onChange={setDateRange}
						/>
					</Field>
				</div>
			</div>

			{/* TODO: Add categories filter */}
			{/* <div className="add-filters-section flex gap-2">
				<div className="statuses w-3/4">
					<EventsListStatuses />
				</div>
				<div className="categories w-1/4">2</div>
			</div> */}
		</div>
	);
};

export default EventsListSearch;
