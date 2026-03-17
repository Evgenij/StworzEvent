// src/actions/organizations/get-my-organizations.action.ts
"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getMyOrganizations() {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new Error("Unauthorized");

	return prisma.organizationMember.findMany({
		where: { userId: session.user.id },
		select: {
			memberRole: true,
			organizations: {
				select: { id: true, name: true, logo: true, slug: true },
			},
		},
	});
}

export type MyOrganization = Awaited<
	ReturnType<typeof getMyOrganizations>
>[number];
