// src/components/dashboard/events/map/event-map-inner.tsx
"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Фикс иконки Leaflet в Next.js
const markerIcon = L.icon({
	iconUrl: "/leaflet/marker-icon.png",
	iconRetinaUrl: "/leaflet/marker-icon-2x.png",
	shadowUrl: "/leaflet/marker-shadow.png",
	iconSize: [33, 41],
	iconAnchor: [17, 41],
	popupAnchor: [0, -41],
	shadowSize: [41, 41],
	shadowAnchor: [0, 41],
});

type Props = {
	lat: number;
	lng: number;
	onMarkerMove: (lat: number, lng: number) => void;
};

function MapViewController({ lat, lng }: { lat: number; lng: number }) {
	const map = useMap();
	useEffect(() => {
		map.setView([lat, lng], 18);
	}, [lat, lng]);
	return null;
}

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
					if (document.activeElement instanceof HTMLElement) {
						document.activeElement.blur();
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
			if (document.activeElement instanceof HTMLElement) {
				document.activeElement.blur();
			}
		},
	});
	return null;
}

export function EventMapInner({ lat, lng, onMarkerMove }: Props) {
	return (
		<MapContainer
			center={[lat, lng]}
			zoom={15}
			className="h-90 w-full rounded-xl z-0"
			scrollWheelZoom={true}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<MapViewController lat={lat} lng={lng} />
			{/* <DraggableMarker lat={lat} lng={lng} onMarkerMove={onMarkerMove} /> */}
			{/* <MapClickHandler onMapClick={onMarkerMove} /> */}
			<Marker position={[lat, lng]} icon={markerIcon} />
		</MapContainer>
	);
}
