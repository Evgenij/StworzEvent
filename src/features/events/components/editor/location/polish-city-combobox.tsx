"use client";

import { useState } from "react";
import {
	Combobox,
	ComboboxContent,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxTrigger,
} from "@/components/shadcn/ui/combobox";
import {
	InputGroupAddon,
	InputGroupButton,
} from "@/components/shadcn/ui/input-group";
import { IconBuildingSkyscraper, IconX } from "@tabler/icons-react";

const POLISH_CITIES = [
	"Warszawa",
	"Kraków",
	"Łódź",
	"Wrocław",
	"Poznań",
	"Gdańsk",
	"Szczecin",
	"Bydgoszcz",
	"Lublin",
	"Białystok",
	"Katowice",
	"Gdynia",
	"Częstochowa",
	"Radom",
	"Sosnowiec",
	"Toruń",
	"Kielce",
	"Rzeszów",
	"Gliwice",
	"Zabrze",
	"Olsztyn",
	"Bielsko-Biała",
	"Bytom",
	"Zielona Góra",
	"Rybnik",
	"Ruda Śląska",
	"Opole",
	"Tychy",
	"Gorzów Wielkopolski",
	"Dąbrowa Górnicza",
	"Elbląg",
	"Płock",
	"Wałbrzych",
	"Włocławek",
	"Tarnów",
	"Chorzów",
	"Koszalin",
	"Kalisz",
	"Legnica",
	"Grudziądz",
	"Jaworzno",
	"Słupsk",
	"Jastrzębie-Zdrój",
	"Nowe Miasto Lubawskie",
	"Siedlce",
	"Mysłowice",
	"Nowy Sącz",
	"Konin",
	"Piotrków Trybunalski",
	"Inowrocław",
	"Leszno",
	"Ostrowiec Świętokrzyski",
	"Suwalki",
];

interface Props {
	value: string;
	onChange: (city: string) => void;
	onBlur?: () => void;
	disabled?: boolean;
	invalid?: boolean;
	placeholder?: string;
}

export function PolishCityCombobox({
	value,
	onChange,
	onBlur,
	disabled,
	invalid,
	placeholder = "Wybierz miasto...",
}: Props) {
	const [inputValue, setInputValue] = useState(value ?? "");

	const hasContent = !!(value || inputValue);

	const filtered = POLISH_CITIES.filter((city) =>
		city.toLowerCase().includes(inputValue.toLowerCase()),
	);

	const selectedItem = POLISH_CITIES.find((c) => c === value) ?? null;

	const handleClear = () => {
		setInputValue("");
		onChange("");
	};

	return (
		<Combobox
			value={selectedItem}
			onValueChange={(city) => {
				onChange(city ?? "");
				setInputValue(city ?? "");
			}}
			items={POLISH_CITIES}
			itemToStringLabel={(city) => city ?? ""}
			isItemEqualToValue={(a, b) => a === b}
			onInputValueChange={(val) => setInputValue(val)}
			disabled={disabled}
		>
			<ComboboxInput
				placeholder={placeholder}
				showTrigger={false}
				showClear={false}
				onBlur={() => {
					if (inputValue && !POLISH_CITIES.includes(inputValue)) {
						onChange(inputValue);
					}
					onBlur?.();
				}}
				disabled={disabled}
				aria-invalid={invalid}
			>
				<InputGroupAddon>
					<IconBuildingSkyscraper />
				</InputGroupAddon>
				<InputGroupAddon align="inline-end">
					{hasContent ? (
						<InputGroupButton
							size="icon-xs"
							variant="ghost"
							onClick={handleClear}
						>
							<IconX className="pointer-events-none" />
						</InputGroupButton>
					) : (
						<InputGroupButton size="icon-xs" variant="ghost" asChild>
							<ComboboxTrigger />
						</InputGroupButton>
					)}
				</InputGroupAddon>
			</ComboboxInput>
			{filtered.length > 0 && (
				<ComboboxContent>
					<ComboboxList>
						{filtered.map((city) => (
							<ComboboxItem key={city} value={city}>
								{city}
							</ComboboxItem>
						))}
					</ComboboxList>
				</ComboboxContent>
			)}
		</Combobox>
	);
}
