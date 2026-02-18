import { NextRequest, NextResponse } from "next/server";
import { getInvitesAction } from "@/actions/invites/get-invites.action";
import { Invitation } from "@prisma/client";

export async function GET(req: NextRequest) {
	try {
		const invites: Invitation[] = await getInvitesAction();
		return NextResponse.json(invites, { status: 200 });
	} catch (error: unknown) {
		// безопасная обработка ошибки
		const message =
			error instanceof Error ? error.message : "Internal Server Error";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
