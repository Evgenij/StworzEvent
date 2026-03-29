import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const { searchParams } = req.nextUrl;
	const lat = searchParams.get("lat");
	const lon = searchParams.get("lon");

	if (!lat || !lon) return NextResponse.json(null, { status: 400 });

	const url = new URL("https://nominatim.openstreetmap.org/reverse");
	url.searchParams.set("lat", lat);
	url.searchParams.set("lon", lon);
	url.searchParams.set("format", "json");
	url.searchParams.set("addressdetails", "1");
	url.searchParams.set("accept-language", "pl");

	const res = await fetch(url.toString(), {
		headers: { "User-Agent": "StworzEvent/1.0 (stworzEvent.pl)" },
	});

	if (!res.ok) return NextResponse.json(null, { status: res.status });
	return NextResponse.json(await res.json());
}
