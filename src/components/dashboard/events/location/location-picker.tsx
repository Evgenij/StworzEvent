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
import { IconLoader, IconMapPin, IconMapQuestion } from "@tabler/icons-react";
import { reverseGeocode, searchAddressCoords } from "@/lib/nominatim";
import type { NominatimPlace, LocationValue } from "@/types/nominatim";
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@/components/shadcn/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/shadcn/ui/field";

const EventMapInner = dynamic(
	() => import("../map/event-map-inner").then((mod) => mod.EventMapInner),
	{
		ssr: false,
		loading: () => (
			<div className="flex h-90 w-full items-center justify-center rounded-xl border bg-muted">
				<IconLoader className="size-6 animate-spin text-muted-foreground" />
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
	const [geocodeNotFound, setGeocodeNotFound] = useState(false);

	// ← ref всегда хранит актуальный value, не зависит от closure
	const valueRef = useRef<LocationValue>(value);
	valueRef.current = value;

	const geocodeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const hasCoords = value.lat !== 0 && value.lng !== 0;

	const handleCityChange = (place: NominatimPlace | null) => {
		setSelectedCity(place);
		setSelectedStreet(null);
		setGeocodeNotFound(false);
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
		setGeocodeNotFound(false);
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

		setGeocodeNotFound(false);
		if (geocodeTimerRef.current) clearTimeout(geocodeTimerRef.current);
		geocodeTimerRef.current = setTimeout(async () => {
			const current = valueRef.current;
			if (!current.city || !current.street || !current.streetNumber)
				return;
			setIsGeocoding(true);
			const query = [current.street, current.streetNumber, current.city]
				.filter(Boolean)
				.join(", ");
			const results = await searchAddressCoords(query);
			setIsGeocoding(false);
			if (!results || (current.streetNumber && !results.hasHouseNumber)) {
				setGeocodeNotFound(true);
				return;
			}
			setGeocodeNotFound(false);
			onChange({
				...valueRef.current,
				lat: results.lat,
				lng: results.lng,
			});
		}, 600);
	};

	// const handleGeocode = async () => {
	// 	if (!canGeocode) return;
	// 	setIsGeocoding(true);
	// 	const query = [value.street, value.streetNumber, value.city].filter(Boolean).join(", ");
	// 	const results = await searchAddressCoords(query);
	// 	setIsGeocoding(false);
	// 	if (!results) return;
	// 	onChange({ ...valueRef.current, lat: results.lat, lng: results.lng });
	// };

	const handleMarkerMove = useCallback(async (lat: number, lng: number) => {
		const snapshot = valueRef.current;

		onChange({ ...snapshot, lat, lng });
		setIsReverseGeocoding(true);

		const result = await reverseGeocode(lat, lng);
		setIsReverseGeocoding(false);

		if (!result) return;

		const newCity = result.city || snapshot.city;
		const newStreet = result.street || snapshot.street;
		const newStreetNumber = result.streetNumber || snapshot.streetNumber;

		onChange({
			lat,
			lng,
			city: newCity,
			street: newStreet,
			streetNumber: newStreetNumber,
		});

		if (newCity) {
			setSelectedCity({
				place_id: Date.now(),
				display_name: newCity,
				name: newCity,
				lat: lat.toString(),
				lon: lng.toString(),
				class: "place",
				type: "city",
				addresstype: "city",
				address: { city: newCity },
			});
		}

		setSelectedStreet(
			newStreet
				? {
						place_id: Date.now() + 1,
						display_name: newStreet,
						name: newStreet,
						lat: lat.toString(),
						lon: lng.toString(),
						class: "highway",
						type: "residential",
						addresstype: "road",
						address: { road: newStreet, city: newCity },
					}
				: null,
		);
	}, []);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col 2xl:flex-row gap-2">
				<Field className="flex-1">
					<FieldLabel>Miasto</FieldLabel>
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
						invalid={invalid}
					/>
				</Field>

				<div className="flex flex-col flex-1 md:flex-row gap-2">
					<Field>
						<FieldLabel>Ulica</FieldLabel>
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
						/>
					</Field>
					<Field>
						<FieldLabel>Nr domu</FieldLabel>
						<InputGroup>
							<InputGroupAddon>
								<InputGroupText>Nr domu</InputGroupText>
							</InputGroupAddon>
							<InputGroupInput
								name="street-number"
								value={value.streetNumber}
								onChange={handleStreetNumberChange}
								onBlur={onBlur}
								disabled={disabled || !value.street}
							/>
						</InputGroup>
					</Field>
				</div>
			</div>

			{geocodeNotFound && (
				<Alert variant="destructive" className="w-full">
					<IconMapQuestion className="size-6" />
					<AlertTitle>Nie znaleziono lokalizacji</AlertTitle>
					<AlertDescription>
						Sawdzaj czy wpisałeś poprawny adres, aby zobaczyć mapę
					</AlertDescription>
				</Alert>
			)}

			{!hasCoords && (
				<div className="flex h-90 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-muted">
					{isGeocoding ? (
						<>
							<IconLoader className="size-8 animate-spin text-muted-foreground/50" />
							<p className="text-sm text-muted-foreground">
								Szukam lokalizacji...
							</p>
						</>
					) : (
						<>
							<IconMapPin className="size-8 text-muted-foreground/50" />
							<p className="text-sm text-muted-foreground">
								Wpisz adres, aby zobaczyć mapę
							</p>
						</>
					)}
				</div>
			)}

			{hasCoords && (
				<div className="flex flex-col gap-1.5">
					{isReverseGeocoding && (
						<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
							<IconLoader className="size-3 animate-spin" />
							Aktualizuję adres...
						</div>
					)}
					<div className="relative">
						<EventMapInner
							lat={value.lat}
							lng={value.lng}
							onMarkerMove={handleMarkerMove}
						/>
						{isGeocoding && (
							<div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/50 backdrop-blur-sm">
								<IconLoader className="size-8 animate-spin text-muted-foreground" />
							</div>
						)}
					</div>
					{/* <p className="flex items-center gap-1 text-xs text-muted-foreground">
						<IconMapPin className="size-3" />
						Przeciągnij znacznik, aby skorygować lokalizację
					</p> */}
				</div>
			)}
		</div>
	);
}
