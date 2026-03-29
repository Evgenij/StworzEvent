"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { CityCombobox } from "./city-combobox";
import { AddressCombobox } from "./address-combobox";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from "@/components/shadcn/ui/input-group";
import { Button } from "@/components/shadcn/ui/button";
import { IconLoader2, IconMapPin, IconSearch } from "@tabler/icons-react";
import { reverseGeocode, searchAddressCoords } from "@/lib/nominatim";
import type { NominatimPlace, LocationValue } from "@/types/nominatim";
import { useTranslations } from "next-intl";

const EventMapInner = dynamic(
	() => import("../map/event-map-inner").then((mod) => mod.EventMapInner),
	{
		ssr: false,
		loading: () => (
			<div className="flex h-64 w-full items-center justify-center rounded-lg border bg-muted">
				<IconLoader2 className="size-6 animate-spin text-muted-foreground" />
			</div>
		),
	},
);

interface Props {
	value: LocationValue;
	onChange: (value: LocationValue) => void;
	onBlur?: () => void;
	disabled?: boolean;
	invalid?: boolean;
}

export function LocationPicker({
	value,
	onChange,
	onBlur,
	disabled,
	invalid,
}: Props) {
	const [selectedCity, setSelectedCity] = useState<NominatimPlace | null>(
		() =>
			value.city
				? {
						place_id: Date.now(),
						display_name: value.city,
						name: value.city,
						lat: value.lat?.toString() ?? "0",
						lon: value.lng?.toString() ?? "0",
						class: "place",
						type: "city",
						addresstype: "city",
						address: { city: value.city },
					}
				: null,
	);
	const [selectedStreet, setSelectedStreet] = useState<NominatimPlace | null>(
		() =>
			value.street
				? {
						place_id: Date.now() + 1,
						display_name: value.street,
						name: value.street,
						lat: value.lat?.toString() ?? "0",
						lon: value.lng?.toString() ?? "0",
						class: "highway",
						type: "residential",
						addresstype: "road",
						address: { road: value.street, city: value.city },
					}
				: null,
	);
	const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
	const [isGeocoding, setIsGeocoding] = useState(false);

	// ← ref всегда хранит актуальный value, не зависит от closure
	const valueRef = useRef<LocationValue>(value);
	valueRef.current = value;

	const hasCoords = value.lat !== 0 && value.lng !== 0;
	const canGeocode = !!value.city && !!value.street;

	const handleCityChange = (place: NominatimPlace | null) => {
		setSelectedCity(place);
		setSelectedStreet(null);
		onChange({
			city: place
				? (place.address.city ?? place.address.town ?? place.name)
				: "",
			street: "",
			streetNumber: "",
			lat: 0,
			lng: 0,
		});
	};

	const handleStreetChange = (place: NominatimPlace | null) => {
		setSelectedStreet(place);
		onChange({
			city: value.city,
			street: place ? (place.address.road ?? place.name) : "",
			streetNumber: value.streetNumber,
			lat: 0,
			lng: 0,
		});
	};

	const handleStreetNumberChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		onChange({ ...value, streetNumber: e.target.value, lat: 0, lng: 0 });
	};

	const handleGeocode = async () => {
		if (!canGeocode) return;
		setIsGeocoding(true);

		const query = [value.street, value.streetNumber, value.city]
			.filter(Boolean)
			.join(", ");

		const results = await searchAddressCoords(query);
		setIsGeocoding(false);

		if (!results) return;

		// читаем из ref — актуальное значение на момент ответа
		onChange({ ...valueRef.current, lat: results.lat, lng: results.lng });
	};

	const handleMarkerMove = useCallback(async (lat: number, lng: number) => {
		const snapshot = valueRef.current;

		onChange({ ...snapshot, lat, lng });
		setIsReverseGeocoding(true);

		const result = await reverseGeocode(lat, lng);
		setIsReverseGeocoding(false);

		if (!result) return;

		onChange({
			lat,
			lng,
			city: result.city || snapshot.city,
			street: result.street || snapshot.street,
			streetNumber: result.streetNumber || snapshot.streetNumber,
		});
	}, []);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col 2xl:flex-row gap-2">
				<CityCombobox
					value={selectedCity}
					onChange={handleCityChange}
					onBlur={onBlur}
					disabled={disabled}
					placeholder={
						!selectedCity && value.city
							? value.city
							: "Wpisz nazwę miasta"
					}
					className=""
					invalid={invalid}
				/>
				<div className="flex flex-1 gap-2">
					<AddressCombobox
						city={value.city}
						value={selectedStreet}
						onChange={handleStreetChange}
						onBlur={onBlur}
						disabled={disabled}
						placeholder={
							!selectedStreet && value.street
								? value.street
								: "Wpisz nazwę ulicy"
						}
						className="flex-2"
					/>
					<InputGroup className="flex-1">
						<InputGroupAddon className="min-w-fit">
							<InputGroupText>Nr domu</InputGroupText>
						</InputGroupAddon>
						<InputGroupInput
							name="street-number"
							value={value.streetNumber}
							onChange={handleStreetNumberChange}
							onBlur={onBlur}
							disabled={disabled || !value.street}
							className=""
						/>
					</InputGroup>
					{/* Кнопка подтверждения */}
					<Button
						type="button"
						variant={"default"}
						disabled={!canGeocode || isGeocoding}
						onClick={handleGeocode}
						className="self-start"
					>
						{isGeocoding ? (
							<IconLoader2 className="size-4 animate-spin" />
						) : (
							<IconSearch className="size-4" />
						)}
						Znajdź na mapie
					</Button>
				</div>
			</div>

			{hasCoords && (
				<div className="flex flex-col gap-1.5">
					{isReverseGeocoding && (
						<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
							<IconLoader2 className="size-3 animate-spin" />
							Aktualizuję adres...
						</div>
					)}
					<EventMapInner
						lat={value.lat}
						lng={value.lng}
						onMarkerMove={handleMarkerMove}
					/>
					<p className="flex items-center gap-1 text-xs text-muted-foreground">
						<IconMapPin className="size-3" />
						Przeciągnij znacznik, aby skorygować lokalizację
					</p>
				</div>
			)}
		</div>
	);
}
