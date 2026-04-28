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
	street: string | null;
	streetNumber: string | null;
	lat?: number;
	lng?: number;
};

const fixLeafletIcon = () => {
	delete (L.Icon.Default.prototype as any)._getIconUrl;
	L.Icon.Default.mergeOptions({
		iconRetinaUrl: "/leaflet/marker-icon-2x.png",
		iconUrl: "/leaflet/marker-icon.png",
		shadowUrl: "/leaflet/marker-shadow.png",
		iconSize: [33, 41],
		iconAnchor: [17, 41],
		popupAnchor: [0, -41],
		shadowSize: [41, 41],
		shadowAnchor: [0, 41],
	});
};

const EventMapSection = ({
	location,
	street,
	streetNumber,
	lat = 50.0647,
	lng = 19.945,
}: EventMapSectionProps) => {
	useEffect(() => {
		fixLeafletIcon();
	}, []);

	if (!location && !street) return null;

	const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${location}, ${street} ${streetNumber}`)}`;

	return (
		<div className="flex flex-col gap-4">
			<header className="w-full flex gap-2 items-center">
				<IconMapPin className="w-6 h-6 text-primary" />
				<Typography variant="h3">Gdzie</Typography>
			</header>
			<div className="address flex gap-2 text-lg">
				<p className="font-semibold">{location}</p>
				<span>-</span>
				<p>
					{street} {streetNumber}
				</p>
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
						{location} — {street} {streetNumber}
					</Popup>
				</Marker>
			</MapContainer>
		</div>
	);
};

export default EventMapSection;
