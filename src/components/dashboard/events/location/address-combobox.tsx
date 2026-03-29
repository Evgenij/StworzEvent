"use client";

import { useState } from "react";
import {
	Combobox,
	ComboboxContent,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "@/components/shadcn/ui/combobox";
import { useAddressSearch } from "@/hooks/use-address-search";
import type { NominatimPlace } from "@/types/nominatim";
import { cn } from "@/lib/utils";

interface Props {
	city: string;
	value: NominatimPlace | null;
	onChange: (place: NominatimPlace | null) => void;
	onBlur?: () => void;
	disabled?: boolean;
	className?: string;
	placeholder?: string;
}

export function AddressCombobox({
	city,
	value,
	onChange,
	onBlur,
	disabled,
	className,
	placeholder,
}: Props) {
	const [inputValue, setInputValue] = useState("");
	const { results, loading, search, clear } = useAddressSearch(city);

	return (
		<Combobox
			value={value}
			onValueChange={onChange}
			disabled={disabled || !city}
			itemToStringLabel={(item) => item?.address.road ?? item?.name ?? ""}
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
				placeholder={
					city
						? "Wyszukaj adres..."
						: (placeholder ?? "Wpisz nazwę ulicy")
				}
				showClear={!!value}
				onBlur={onBlur}
				disabled={disabled || !city}
				className={cn("", className)}
			/>
			<ComboboxContent className="p-1">
				<ComboboxList>
					{results.length === 0 ? (
						<div className="py-2 text-center text-sm text-muted-foreground">
							{loading
								? "Szukam..."
								: (placeholder ?? "Wpisz nazwę ulicy")}
						</div>
					) : (
						results.map((place) => {
							const streetName = place.address.road ?? place.name;
							return (
								<ComboboxItem
									key={place.place_id}
									value={place}
									className="p-1 px-2"
								>
									<span className="flex flex-col gap-0.5">
										<span>{streetName}</span>
										<span className="text-xs text-muted-foreground">
											{place.address.suburb ??
												place.address.quarter ??
												""}
										</span>
									</span>
								</ComboboxItem>
							);
						})
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	);
}
