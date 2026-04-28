"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createOrganizationServerSchema } from "@/schemas/create-organization.schema";
import { safeAction } from "@/lib/safe-action";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";
import { slugify } from "@/lib/slugify/slugify";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";

async function generateUniqueOrgSlug(name: string): Promise<string> {
	const base = slugify(name);
	let slug = base;
	let counter = 2;

	while (await prisma.organization.findUnique({ where: { slug } })) {
		slug = `${base}-${counter++}`;
	}

	return slug;
}

export const createOrganizationAction = safeAction(async (input: unknown) => {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);

	const data = createOrganizationServerSchema.parse(input);

	const slug = await generateUniqueOrgSlug(data.name);

	const org = await prisma.$transaction(async (tx) => {
		const org = await tx.organization.create({
			data: {
				name: data.name,
				slug,
				nip: data.nip,
				email: data.email,
				phone: data.phone,
				legalForm: data.legalForm,
				vatStatus: data.vatStatus,
			},
		});

		await tx.organizationAddress.create({
			data: {
				type: "REGISTERED",
				street: data.address.street,
				buildingNumber: data.address.buildingNumber,
				zipCode: data.address.zipCode,
				city: data.address.city,
				country: "COUNTRY_PL",
				organizationId: org.id,
			},
		});

		await tx.organizationMember.create({
			data: {
				userId: session.user.id,
				organizationId: org.id,
				memberRole: "OWNER",
			},
		});

		return org;
	});

	await prisma.user.update({
		where: {
			id: session.user.id,
		},
		data: {
			role: UserRole.ORGANIZER,
		},
	});

	return { organizationId: org.id, slug: org.slug };
});
