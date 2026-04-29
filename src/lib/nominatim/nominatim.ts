// src/lib/nominatim.ts
import { APP_CONFIG } from "@/config/app";
import type { NominatimPlace } from "@/lib/nominatim/nominatim.types";
import { userAgent } from "next/server";

async function nominatimFetch(
	params: Record<string, string>,
): Promise<NominatimPlace[]> {
	const url = new URL(
		"/api/nominatim",
		typeof window !== "undefined"
			? window.location.origin
			: (process.env.NEXT_PUBLIC_APP_URL ?? ""),
	);
	Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
	const res = await fetch(url.toString());
	if (!res.ok) return [];
	return res.json();
}

export async function searchCities(query: string): Promise<NominatimPlace[]> {
	const results = await nominatimFetch({
		q: query,
		limit: "10",
		featureType: "city",
		userAgent: `${APP_CONFIG.name}/${APP_CONFIG.version} (${APP_CONFIG.email})`,
	});

	const filtered = results.filter((r) =>
		["city", "town", "village", "municipality", "administrative"].includes(
			r.addresstype,
		),
	);

	const seen = new Set<string>();
	return filtered.filter((r) => {
		const cityName =
			r.address.city ?? r.address.town ?? r.address.village ?? r.name;
		if (seen.has(cityName)) return false;
		seen.add(cityName);
		return true;
	});
}

// Только улицы
export async function searchStreets(
	query: string,
	city: string,
): Promise<NominatimPlace[]> {
	const results = await nominatimFetch({
		q: `${query}, ${city}`,
		limit: "8",
		featureType: "highway",
		userAgent: `${APP_CONFIG.name}/${APP_CONFIG.version} (${APP_CONFIG.email})`,
	});

	// только highway = улицы, дедупликация по названию улицы
	const streets = results.filter((r) => r.class === "highway");

	const seen = new Set<string>();
	return streets.filter((r) => {
		const streetName = r.address.road ?? r.name;
		if (!streetName || seen.has(streetName)) return false;
		seen.add(streetName);
		return true;
	});
}

// Только улицы и конкретные адреса в выбранном городе
const ADDRESS_CLASSES = new Set(["highway", "building", "place"]);

export async function searchAddresses(
	query: string,
	city: string,
): Promise<NominatimPlace[]> {
	const results = await nominatimFetch({
		q: `${query}, ${city}`,
		limit: "10",
		userAgent: `${APP_CONFIG.name}/${APP_CONFIG.version} (${APP_CONFIG.email})`,
	});

	return results.filter((r) => ADDRESS_CLASSES.has(r.class));
}

export async function reverseGeocode(
	lat: number,
	lng: number,
): Promise<{
	city: string;
	street: string;
	streetNumber: string;
} | null> {
	try {
		const url = new URL(
			"/api/nominatim/reverse",
			typeof window !== "undefined"
				? window.location.origin
				: (process.env.NEXT_PUBLIC_APP_URL ?? ""),
		);
		url.searchParams.set("lat", lat.toString());
		url.searchParams.set("lon", lng.toString());

		const res = await fetch(url.toString());
		if (!res.ok) return null;

		const data = await res.json();
		const addr = data.address;

		return {
			city: addr.city ?? addr.town ?? addr.village ?? "",
			street: addr.road ?? "",
			streetNumber: addr.house_number ?? "",
		};
	} catch {
		return null;
	}
}

export async function searchAddressCoords(
	query: string,
): Promise<{ lat: number; lng: number; hasHouseNumber: boolean } | null> {
	const results = await nominatimFetch({
		q: query,
		limit: "1",
		addressdetails: "1",
	});
	if (!results.length) return null;
	return {
		lat: parseFloat(results[0].lat),
		lng: parseFloat(results[0].lon),
		hasHouseNumber: !!results[0].address.house_number,
	};
}
