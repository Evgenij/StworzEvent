type GeocodeResult = {
	lat: number;
	lng: number;
} | null;

export async function geocodeAddress(
	address: string,
	city: string,
): Promise<GeocodeResult> {
	const query = `${address}, ${city}, Poland`;

	try {
		const res = await fetch(
			`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
			{
				headers: {
					"User-Agent": "StworzEvent.pl/1.0 (contact@stworzevent.pl)",
				},
				next: { revalidate: 0 }, // не кэшируем — адреса меняются
			},
		);

		if (!res.ok) return null;

		const data = await res.json();
		if (!data[0]) return null;

		return {
			lat: parseFloat(data[0].lat),
			lng: parseFloat(data[0].lon),
		};
	} catch {
		return null;
	}
}
