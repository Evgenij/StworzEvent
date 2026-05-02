import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const token = request.nextUrl.searchParams.get("token");

	if (!token || token !== process.env.BYPASS_TOKEN) {
		return NextResponse.redirect(new URL("/pl", request.url));
	}

	const response = NextResponse.redirect(new URL("/pl/events", request.url));

	response.cookies.set("bypass_token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 60 * 60 * 24 * 30,
		path: "/",
	});

	return response;
}
