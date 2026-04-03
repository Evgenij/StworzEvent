// src/components/dashboard/events/map/event-map-editor.tsx
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Button } from "@/components/shadcn/ui/button";
import { Label } from "@/components/shadcn/ui/label";
import { Field } from "@/components/shadcn/ui/field";
import { Switch } from "@/components/shadcn/ui/switch";
import { IconLoader, IconMapPin, IconSearch } from "@tabler/icons-react";
import { updateEventMapAction } from "@/actions/events/update-event-map.action";
import { geocodeAddress } from "@/lib/geocode";
import { toast } from "sonner";
import type { EventMapData } from "@/actions/events/map/get-event-map.action";

// Динамический импорт — Leaflet не работает на сервере
const EventMapInner = dynamic(
	() => import("./event-map-inner").then((mod) => mod.EventMapInner),
	{
		ssr: false,
		loading: () => (
			<div className="flex h-64 w-full items-center justify-center rounded-lg border bg-muted">
				<IconLoader className="size-6 animate-spin text-muted-foreground" />
			</div>
		),
	},
);

type Props = {
	eventId: string;
	initialData: EventMapData;
};

// Варшава по умолчанию если координат нет
const DEFAULT_LAT = 52.2297;
const DEFAULT_LNG = 21.0122;

export function EventMapEditor({ eventId, initialData }: Props) {
	const t = useTranslations("EventWizard.map");

	const [lat, setLat] = useState<number>(initialData?.lat ?? DEFAULT_LAT);
	const [lng, setLng] = useState<number>(initialData?.lng ?? DEFAULT_LNG);
	const [showMap, setShowMap] = useState<boolean>(
		initialData?.showMap ?? true,
	);
	const [isGeocoding, setIsGeocoding] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [hasCoords, setHasCoords] = useState(
		!!(initialData?.lat && initialData?.lng),
	);

	const handleGeocode = async () => {
		if (!initialData?.street && !initialData?.location) {
			toast.error(t("noAddressError"));
			return;
		}

		setIsGeocoding(true);

		const result = await geocodeAddress(
			initialData?.street ?? "",
			initialData?.location ?? "",
		);

		setIsGeocoding(false);

		if (!result) {
			toast.error(t("geocodeError"));
			return;
		}

		setLat(result.lat);
		setLng(result.lng);
		setHasCoords(true);
		toast.success(t("geocodeSuccess"));
	};

	const handleMarkerMove = (newLat: number, newLng: number) => {
		setLat(newLat);
		setLng(newLng);
	};

	const handleSave = async () => {
		setIsSaving(true);

		const result = await updateEventMapAction({
			eventId,
			lat: hasCoords ? lat : null,
			lng: hasCoords ? lng : null,
			showMap,
		});

		setIsSaving(false);

		if (!result.success) {
			toast.error(t("errors.saveFailed"));
			return;
		}

		toast.success(t("saved"));
	};

	return (
		<div className="flex flex-col gap-4">
			{/* Toggle показа карты */}
			<Field
				orientation="horizontal"
				className="justify-between rounded-lg border p-3"
			>
				<div className="flex flex-col gap-0.5">
					<Label>{t("showMap")}</Label>
					<p className="text-xs text-muted-foreground">
						{t("showMapHint")}
					</p>
				</div>
				<Switch checked={showMap} onCheckedChange={setShowMap} />
			</Field>

			{showMap && (
				<>
					{/* Кнопка геокодинга */}
					<div className="flex items-center gap-2">
						<div className="flex-1 rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground">
							{initialData?.street && initialData?.location
								? `${initialData.street}, ${initialData.location}`
								: t("noAddress")}
						</div>
						<Button
							type="button"
							variant="outline"
							disabled={isGeocoding}
							onClick={handleGeocode}
						>
							{isGeocoding ? (
								<IconLoader className="mr-2 size-4 animate-spin" />
							) : (
								<IconSearch className="mr-2 size-4" />
							)}
							{t("findOnMap")}
						</Button>
					</div>

					{/* Карта */}
					{hasCoords ? (
						<div className="flex flex-col gap-1.5">
							<EventMapInner
								lat={lat}
								lng={lng}
								onMarkerMove={handleMarkerMove}
							/>
							<p className="flex items-center gap-1 text-xs text-muted-foreground">
								<IconMapPin className="size-3" />
								{t("dragHint")}
							</p>
						</div>
					) : (
						<div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed gap-2">
							<IconMapPin className="size-8 text-muted-foreground/50" />
							<p className="text-sm text-muted-foreground">
								{t("noCoords")}
							</p>
						</div>
					)}
				</>
			)}

			{/* Сохранить */}
			<Button
				type="button"
				size="sm"
				disabled={isSaving}
				onClick={handleSave}
				className="self-end"
			>
				{isSaving ? (
					<>
						<IconLoader className="mr-2 size-4 animate-spin" />
						{t("saving")}
					</>
				) : (
					t("save")
				)}
			</Button>
		</div>
	);
}
