import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ErrorCode } from "@/types/error-code";

export async function GET() {
	try {
		const invites = await prisma.invitation.findMany({
			orderBy: { createdAt: "desc" },
		});

		return NextResponse.json(invites);
	} catch (error) {
		console.error(error);

		return NextResponse.json(
			{ code: ErrorCode.FETCH_FAILED },
			{ status: 500 },
		);
	}
}
