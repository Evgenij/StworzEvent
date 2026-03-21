// src/components/dashboard/events/map/event-map-inner.tsx
"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Фикс иконки Leaflet в Next.js
const markerIcon = L.icon({
	iconUrl: "/leaflet/marker-icon.png",
	iconRetinaUrl: "/leaflet/marker-icon-2x.png",
	shadowUrl: "/leaflet/marker-shadow.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
});

type Props = {
	lat: number;
	lng: number;
	onMarkerMove: (lat: number, lng: number) => void;
};

// Компонент для перетаскивания маркера
function DraggableMarker({ lat, lng, onMarkerMove }: Props) {
	const markerRef = useRef<L.Marker>(null);

	return (
		<Marker
			position={[lat, lng]}
			icon={markerIcon}
			draggable
			ref={markerRef}
			eventHandlers={{
				dragend: () => {
					const marker = markerRef.current;
					if (marker) {
						const pos = marker.getLatLng();
						onMarkerMove(pos.lat, pos.lng);
					}
				},
			}}
		/>
	);
}

// Компонент для клика по карте
function MapClickHandler({
	onMapClick,
}: {
	onMapClick: (lat: number, lng: number) => void;
}) {
	useMapEvents({
		click: (e) => {
			onMapClick(e.latlng.lat, e.latlng.lng);
		},
	});
	return null;
}

export function EventMapInner({ lat, lng, onMarkerMove }: Props) {
	return (
		<MapContainer
			center={[lat, lng]}
			zoom={15}
			className="h-64 w-full rounded-lg"
			scrollWheelZoom={false}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<DraggableMarker lat={lat} lng={lng} onMarkerMove={onMarkerMove} />
			<MapClickHandler onMapClick={onMarkerMove} />
		</MapContainer>
	);
}
