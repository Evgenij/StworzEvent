import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const { searchParams } = req.nextUrl;
	const url = new URL("https://nominatim.openstreetmap.org/search");

	searchParams.forEach((v, k) => url.searchParams.set(k, v));
	// эти параметры всегда фиксированы
	url.searchParams.set("format", "json");
	url.searchParams.set("addressdetails", "1");
	url.searchParams.set("accept-language", "pl");
	url.searchParams.set("countrycodes", "pl");
	url.searchParams.set("featuretype", "city");

	const res = await fetch(url.toString(), {
		headers: { "User-Agent": "StworzEvent/1.0 (stworzEvent.pl)" },
		next: { revalidate: 60 },
	});

	if (!res.ok) return NextResponse.json([], { status: res.status });
	return NextResponse.json(await res.json());
}
