import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ErrorCode } from "@/types/error-code";
import { auth } from "@/lib/auth";
import { useSession } from "@/lib/auth-client";
import { headers } from "next/headers";
import { MemberRole } from "@prisma/client";
import { ApiError } from "@/error/api-error";

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const organizationId = searchParams.get("organizationId");

		console.log("organizationId", organizationId);

		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new ApiError(ErrorCode.UNAUTHORIZED);
		}

		console.log("user.id", session.user);

		const events = await prisma.event.findMany({
			where: {
				organization: {
					organizationMembers: {
						some: {
							userId: session.user.id,
							memberRole: MemberRole.OWNER,
						},
					},
				},
			},
		});

		console.log("events", events);

		//console.log("GET /events", user);

		// const events = await prisma.event.findMany({
		// 	where: {
		// 		organizationId: user.organizationId,
		// 	},
		// });

		return NextResponse.json({ success: true, data: events });
	} catch (error) {
		console.error(error);

		return NextResponse.json(
			{ code: ErrorCode.FETCH_FAILED },
			{ status: 500 },
		);
	}
}
