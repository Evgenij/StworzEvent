"use client";

import { useState } from "react";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "@/components/ui/combobox";
import { useCitySearch } from "@/features/events/hooks/use-city-search";
import type { NominatimPlace } from "@/lib/nominatim/nominatim.types";
import { cn } from "@/lib/utils";
import { InputGroupAddon } from "@/components/ui/input-group";
import { IconBuildingSkyscraper, IconLoader } from "@tabler/icons-react";
import { spawn } from "node:child_process";

interface Props {
	value: NominatimPlace | null;
	onChange: (place: NominatimPlace | null) => void;
	onBlur?: () => void;
	disabled?: boolean;
	className?: string;
	placeholder?: string;
	invalid?: boolean;
}

export function CityCombobox({
	value,
	onChange,
	onBlur,
	disabled,
	className,
	placeholder,
	invalid,
}: Props) {
	const [inputValue, setInputValue] = useState("");
	const { results, loading, search, clear } = useCitySearch();

	const displayName = (place: NominatimPlace) => {
		const addr = place.address;
		return (
			addr.city ??
			addr.town ??
			addr.village ??
			addr.municipality ??
			place.name
		);
	};

	return (
		<Combobox
			value={value}
			onValueChange={onChange}
			disabled={disabled}
			itemToStringLabel={(item) => (item ? displayName(item) : "")}
			isItemEqualToValue={(a, b) => a?.place_id === b?.place_id}
			onInputValueChange={(val) => {
				setInputValue(val);
				if (val) search(val);
				else {
					clear();
					onChange(null);
				}
			}}
		>
			<ComboboxInput
				placeholder={placeholder ?? "Wyszukaj miasto..."}
				showClear={!!value}
				onBlur={onBlur}
				disabled={disabled}
				className={cn("", className)}
				aria-invalid={invalid}
			>
				<InputGroupAddon>
					<IconBuildingSkyscraper />
				</InputGroupAddon>
			</ComboboxInput>
			<ComboboxContent className="p-1">
				{/* ComboboxEmpty убери совсем */}
				<ComboboxList>
					{results.length === 0 ? (
						<div className="py-2 text-center text-sm text-muted-foreground">
							{loading ? (
								<span className="flex items-center justify-center">
									<IconLoader className="size-5 gap-2 animate-spin" />{" "}
									Szukam...
								</span>
							) : (
								"Wpisz nazwe miasta"
							)}
						</div>
					) : (
						results.map((place) => (
							<ComboboxItem key={place.place_id} value={place}>
								{displayName(place)}
								<span className="ml-auto text-xs text-muted-foreground truncate max-w-32">
									{place.address.state ?? ""}
								</span>
							</ComboboxItem>
						))
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	);
}
