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

interface Props {
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
}

export function CategoryCombobox({ value, onChange, disabled }: Props) {
	const [open, setOpen] = useState(false);

	const { data: categories = [], isLoading } = useQuery({
		queryKey: ["categories"],
		queryFn: () => getCategories(),
		staleTime: 1000 * 60 * 10,
	});

	const selected = categories.find((c) => c.id === value);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					disabled={disabled || isLoading}
					className="w-full justify-between font-normal"
				>
					{isLoading ? (
						<IconLoader2 className="size-4 animate-spin" />
					) : selected ? (
						<span className="flex items-center gap-2">
							{selected.icon && <span>{selected.icon}</span>}
							{selected.name}
						</span>
					) : (
						<span className="text-muted-foreground">
							Wybierz kategorię...
						</span>
					)}
					<IconChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0" align="start">
				<Command>
					<CommandInput placeholder="Szukaj kategorii..." />
					<CommandList>
						<CommandEmpty>Nie znaleziono kategorii</CommandEmpty>
						{categories.map((category) => (
							<CommandItem
								key={category.id}
								value={category.name}
								onSelect={() => {
									onChange(category.id);
									setOpen(false);
								}}
							>
								<IconCheck
									className={cn(
										"mr-2 size-4",
										value === category.id
											? "opacity-100"
											: "opacity-0",
									)}
								/>
								{category.icon && (
									<span className="mr-2">
										{category.icon}
									</span>
								)}
								{category.name}
							</CommandItem>
						))}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
