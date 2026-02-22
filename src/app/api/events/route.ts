import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ErrorCode } from "@/types/error-code";

export async function GET(organizationId: string) {
	try {
		const events = await prisma.event.findMany({
			where: {
				organizationId: organizationId,
			},
		});

		return NextResponse.json(events);
	} catch (error) {
		console.error(error);

		return NextResponse.json(
			{ code: ErrorCode.FETCH_FAILED },
			{ status: 500 },
		);
	}
}
