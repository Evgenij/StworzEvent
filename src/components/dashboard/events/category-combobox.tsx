// src/components/dashboard/events/category-combobox.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import {
	getCategories,
	type CategoryOption,
} from "@/actions/events/get-categories.action";
import { Button } from "@/components/shadcn/ui/button";
import {
	Command,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/shadcn/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/shadcn/ui/popover";
import { IconCheck, IconChevronDown, IconLoader2 } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import QUERY_KEYS from "@/consts/query-keys";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "@/components/shadcn/ui/combobox";

interface Props {
	value: string;
	onChange: (value: string) => void;
	onBlur?: () => void;
	disabled?: boolean;
}

export function CategoryCombobox({ value, onChange, onBlur, disabled }: Props) {
	const { data: categories = [], isLoading } = useQuery({
		queryKey: [QUERY_KEYS.EVENTS.CATEGORIES],
		queryFn: () => getCategories(),
		staleTime: 1000 * 60 * 10,
	});

	const selected = categories.find((c) => c.id === value);

	return (
		<Combobox
			value={selected ?? null}
			onValueChange={(item) => {
				onChange(item?.id ?? "");
			}}
			items={categories}
			disabled={isLoading}
			itemToStringLabel={(item) => item?.name ?? ""}
			isItemEqualToValue={(a, b) => a?.id === b?.id}
		>
			<ComboboxInput
				placeholder="Wybierz kategorię"
				showClear={!!value}
				onBlur={onBlur}
				disabled={disabled}
			/>
			<ComboboxContent>
				<ComboboxEmpty>Nie znaleziono kategorii</ComboboxEmpty>
				<ComboboxList>
					{categories.map((category) => (
						<ComboboxItem key={category.id} value={category}>
							{category.icon && <span>{category.icon}</span>}
							{category.name}
						</ComboboxItem>
					))}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
		// <Popover open={open} onOpenChange={setOpen}>
		// 	<PopoverTrigger asChild>
		// 		<Button
		// 			variant="outline"
		// 			role="combobox"
		// 			disabled={disabled || isLoading}
		// 			className="w-full justify-between font-normal"
		// 		>
		// 			{isLoading ? (
		// 				<IconLoader2 className="size-4 animate-spin" />
		// 			) : selected ? (
		// 				<span className="flex items-center gap-2">
		// 					{selected.icon && <span>{selected.icon}</span>}
		// 					{selected.name}
		// 				</span>
		// 			) : (
		// 				<span className="text-muted-foreground">
		// 					Wybierz kategorię...
		// 				</span>
		// 			)}
		// 			<IconChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
		// 		</Button>
		// 	</PopoverTrigger>
		// 	<PopoverContent className="w-full p-0" align="start">
		// 		<Command>
		// 			<CommandInput placeholder="Szukaj kategorii..." />
		// 			<CommandList>
		// 				<CommandEmpty>Nie znaleziono kategorii</CommandEmpty>
		// 				{categories.map((category) => (
		// 					<CommandItem
		// 						key={category.id}
		// 						value={category.name}
		// 						onSelect={() => {
		// 							onChange(category.id);
		// 							setOpen(false);
		// 						}}
		// 					>
		// 						<IconCheck
		// 							className={cn(
		// 								"mr-2 size-4",
		// 								value === category.id
		// 									? "opacity-100"
		// 									: "opacity-0",
		// 							)}
		// 						/>
		// 						{category.icon && (
		// 							<span className="mr-2">
		// 								{category.icon}
		// 							</span>
		// 						)}
		// 						{category.name}
		// 					</CommandItem>
		// 				))}
		// 			</CommandList>
		// 		</Command>
		// 	</PopoverContent>
		// </Popover>
	);
}
