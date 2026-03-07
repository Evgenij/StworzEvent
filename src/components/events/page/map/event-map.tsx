"use client";

import { Typography } from "@/components/shared";
import { IconLocation, IconMapPin, IconNavigation } from "@tabler/icons-react";
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Separator } from "@/components/shadcn/ui/separator";

type EventMapSectionProps = {
	location: string | null;
	address: string | null;
	lat?: number;
	lng?: number;
};

const fixLeafletIcon = () => {
	delete (L.Icon.Default.prototype as any)._getIconUrl;
	L.Icon.Default.mergeOptions({
		iconRetinaUrl:
			"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
		iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
		shadowUrl:
			"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
	});
};

const EventMapSection = ({
	location,
	address,
	lat = 50.0647,
	lng = 19.945,
}: EventMapSectionProps) => {
	useEffect(() => {
		fixLeafletIcon();
	}, []);

	if (!location && !address) return null;

	const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`Krakow, Drukarska 8`)}`;

	return (
		<div className="flex flex-col gap-4">
			<header className="w-full flex gap-2 items-center">
				<IconMapPin className="w-6 h-6 text-primary" />
				<Typography variant="h3">Gdzie</Typography>
			</header>
			<div className="address flex gap-2 text-lg">
				<p className="font-semibold">{location}</p>
				<span>-</span>
				<p>{address}</p>
				<Separator orientation="vertical" />
				<a
					href={mapsUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="text-primary text-base flex gap-1 items-center hover:underline"
				>
					<IconLocation className="size-4" />
					Jak dojechać?
				</a>
			</div>

			<MapContainer
				center={[lat, lng]}
				zoom={14}
				className="w-full h-90 rounded-md z-0"
			>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
				/>
				<Marker position={[lat, lng]}>
					<Popup>
						{location} — {address}
					</Popup>
				</Marker>
			</MapContainer>
		</div>
	);
};

export default EventMapSection;
