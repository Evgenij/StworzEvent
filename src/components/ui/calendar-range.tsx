"use client";

import * as React from "react";
import { type DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { IconCalendar, IconX } from "@tabler/icons-react";

type CalendarRangeProps = {
	value?: DateRange | undefined;
	onChange?: (value: DateRange | undefined) => void;
	className?: string;
};

export function CalendarRange({ value, onChange, className }: CalendarRangeProps) {
	// const today = new Date(
	// 	new Date().getFullYear(),
	// 	new Date().getMonth(),
	// 	new Date().getDate(),
	// );
	const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
		from: value?.from,
		to: value?.to,
	});

	const handleDatesChange = (dateRange: DateRange | undefined) => {
		setDateRange(dateRange);
		onChange?.(dateRange);
	};

	const handleClear = () => {
		setDateRange(undefined);
		onChange?.(undefined);
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<InputGroup className={className}>
					<InputGroupAddon>
						<IconCalendar />
					</InputGroupAddon>
					<InputGroupInput
						placeholder="Wybierz termin"
						readOnly
						value={
							dateRange
								? `${dateRange?.from?.toLocaleDateString()} - ${dateRange?.to?.toLocaleDateString()}`
								: ""
						}
					/>
					{dateRange && (
						<InputGroupAddon
							align="inline-end"
							onClick={(e) => {
								e.stopPropagation();
								handleClear();
							}}
						>
							<Button variant="ghost" size="icon-xs">
								<IconX />
							</Button>
						</InputGroupAddon>
					)}
				</InputGroup>
			</PopoverTrigger>
			<PopoverContent className="w-fit">
				{/* <Card className="mx-auto w-fit p-0"> */}
				<Calendar
					mode="range"
					defaultMonth={dateRange?.from}
					selected={dateRange}
					onSelect={handleDatesChange}
					numberOfMonths={2}
					disabled={(date) => date < new Date("1900-01-01")}
				/>
				{/* </Card> */}
			</PopoverContent>
		</Popover>
	);
}
