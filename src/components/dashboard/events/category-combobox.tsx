// src/components/dashboard/events/category-combobox.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import {
	getCategories,
	type CategoryOption,
} from "@/actions/events/get-categories.action";

import QUERY_KEYS from "@/consts/query-keys";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "@/components/shadcn/ui/combobox";
import { useState } from "react";
import { InputGroupAddon } from "@/components/shadcn/ui/input-group";
import {
	IconLoader,
	IconLoader2,
	IconTag,
	IconTagFilled,
} from "@tabler/icons-react";

interface Props {
	value: string;
	onChange: (item: CategoryOption | null) => void;
	onBlur?: () => void;
	disabled?: boolean;
	invalid?: boolean;
}

export function CategoryCombobox({
	value,
	onChange,
	onBlur,
	disabled,
	invalid,
}: Props) {
	const [inputValue, setInputValue] = useState("");
	const { data: categories = [], isLoading } = useQuery({
		queryKey: [QUERY_KEYS.EVENTS.CATEGORIES],
		queryFn: () => getCategories(),
		staleTime: 1000 * 60 * 10,
	});

	const filtered = categories.filter((c) =>
		c.name.toLowerCase().includes(inputValue.toLowerCase()),
	);

	const selected = categories.find((c) => c.id === value);

	return (
		<Combobox
			value={selected ?? null}
			onValueChange={(item) => onChange(item ?? null)}
			items={categories}
			disabled={isLoading}
			itemToStringLabel={(item) => item?.name ?? ""}
			isItemEqualToValue={(a, b) => a?.id === b?.id}
			onInputValueChange={(val) => setInputValue(val)}
		>
			<ComboboxInput
				placeholder={isLoading ? "Ładowanie..." : "Wybierz kategorię"}
				showClear={!!value}
				onBlur={onBlur}
				disabled={disabled}
				aria-invalid={invalid}
			>
				<InputGroupAddon>
					{isLoading ? (
						<IconLoader className="animate-spin" />
					) : (
						<IconTag />
					)}
				</InputGroupAddon>
			</ComboboxInput>
			<ComboboxContent>
				<ComboboxEmpty>Nie znaleziono kategorii</ComboboxEmpty>
				<ComboboxList>
					{filtered.map((category) => (
						<ComboboxItem key={category.id} value={category}>
							{category.icon && <span>{category.icon}</span>}
							{category.name}
						</ComboboxItem>
					))}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	);
}
