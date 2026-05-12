"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { safeAction } from "@/lib/safe-action";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";
import {
	organizationGeneralServerSchema,
	type OrganizationGeneralInput,
} from "@/features/organizations/schemas/organization-general.schema";

type Input = { organizationId: string; data: OrganizationGeneralInput };

export const updateOrganizationGeneralAction = safeAction(
	async ({ organizationId, data }: Input) => {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session) throw new ApiError(ErrorCode.UNAUTHORIZED, 401);

		const member = await prisma.organizationMember.findFirst({
			where: {
				organizationId,
				userId: session.user.id,
				memberRole: { in: ["OWNER", "MANAGER"] },
			},
			select: { id: true },
		});
		if (!member) throw new ApiError(ErrorCode.FORBIDDEN, 403);

		const parsed = organizationGeneralServerSchema.parse(data);

		await prisma.organization.update({
			where: { id: organizationId },
			data: {
				name: parsed.name,
				nip: parsed.nip ?? null,
				regon: parsed.regon ?? null,
				krs: parsed.krs ?? null,
				legalForm: parsed.legalForm ?? null,
				legalFormCode: parsed.legalFormCode ?? null,
				vatStatus: parsed.vatStatus ?? null,
				vatId: parsed.vatId ?? null,
				website: parsed.website ?? null,
				phone: parsed.phone ?? null,
				email: parsed.email ?? null,
				industry: parsed.industry ?? null,
				mainPkdCode: parsed.mainPkdCode ?? null,
				employeeCountRange: parsed.employeeCountRange ?? null,
			},
		});

		return { success: true };
	},
);
