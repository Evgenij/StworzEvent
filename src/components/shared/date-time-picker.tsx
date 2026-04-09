// src/components/shared/date-time-picker.tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/shadcn/ui/button";
import { Calendar } from "@/components/shadcn/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/shadcn/ui/popover";
// import { ScrollArea, ScrollBar } from "@/components/shadcn/ui/scroll-area";
import { IconCalendar } from "@tabler/icons-react";
import { ScrollArea } from "../shadcn/ui/scroll-area";
import { DateTimeFormatter } from "@/helpers/date-formatter";

type Props = {
	value?: string; // ISO string "2024-03-21T14:30"
	onChange?: (value: string) => void;
	onBlur?: () => void;
	disabled?: boolean;
	placeholder?: string;
	"aria-invalid"?: boolean;
};

export function DateTimePicker({
	value,
	onChange,
	onBlur,
	disabled,
	placeholder = "Wybierz datę i godzinę",
	"aria-invalid": ariaInvalid,
}: Props) {
	const [open, setOpen] = useState(false);

	// Конвертируем string → Date для Calendar
	const dateValue = value ? new Date(value) : undefined;

	const handleDateSelect = (date: Date | undefined) => {
		if (!date) return;

		const current = dateValue ?? new Date();
		date.setHours(current.getHours());
		date.setMinutes(current.getMinutes());

		onChange?.(DateTimeFormatter.timeISO(date));
	};

	const handleTimeChange = (type: "hour" | "minute", val: string) => {
		const current = dateValue ?? new Date();
		const newDate = new Date(current);

		if (type === "hour") newDate.setHours(parseInt(val, 10));
		if (type === "minute") newDate.setMinutes(parseInt(val, 10));

		onChange?.(DateTimeFormatter.timeISO(newDate));
	};

	return (
		<Popover
			open={open}
			onOpenChange={(o) => {
				setOpen(o);
				if (!o) onBlur?.(); // триггерим onBlur при закрытии — для react-hook-form mode="onBlur"
			}}
		>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="outline"
					disabled={disabled}
					aria-invalid={ariaInvalid}
					className={cn(
						"w-full justify-start text-left font-normal",
						!dateValue && "text-muted-foreground",
						ariaInvalid && "border-destructive",
					)}
				>
					<IconCalendar className="mr-2 size-4 opacity-50" />
					{dateValue
						? format(dateValue, "d MMM yyyy, HH:mm", { locale: pl })
						: placeholder}
				</Button>
			</PopoverTrigger>

			<PopoverContent className="w-auto p-0" align="start">
				<div className="flex">
					{/* Календарь */}
					<Calendar
						mode="single"
						selected={dateValue}
						onSelect={handleDateSelect}
						locale={pl}
						disabled={{ before: new Date() }}
					/>

					{/* Время */}
					<div className="flex divide-x border-l">
						{/* Часы */}
						<ScrollArea className="h-75 w-16">
							<div className="flex flex-col p-2 gap-1">
								{Array.from({ length: 24 }, (_, i) => i).map(
									(hour) => (
										<Button
											key={hour}
											type="button"
											size="icon"
											variant={
												dateValue?.getHours() === hour
													? "default"
													: "ghost"
											}
											className="w-full shrink-0"
											onClick={() =>
												handleTimeChange(
													"hour",
													hour.toString(),
												)
											}
										>
											{hour.toString().padStart(2, "0")}
										</Button>
									),
								)}
							</div>
						</ScrollArea>

						{/* Минуты */}
						<ScrollArea className="h-75 w-16">
							<div className="flex flex-col p-2 gap-1">
								{Array.from(
									{ length: 12 },
									(_, i) => i * 5,
								).map((minute) => (
									<Button
										key={minute}
										type="button"
										size="icon"
										variant={
											dateValue?.getMinutes() === minute
												? "default"
												: "ghost"
										}
										className="w-full shrink-0"
										onClick={() =>
											handleTimeChange(
												"minute",
												minute.toString(),
											)
										}
									>
										{minute.toString().padStart(2, "0")}
									</Button>
								))}
							</div>
						</ScrollArea>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}

// Форматируем в "YYYY-MM-DDTHH:mm" без timezone смещения
// function formatToLocalISO(date: Date): string {
// 	const pad = (n: number) => n.toString().padStart(2, "0");
// 	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
// }
