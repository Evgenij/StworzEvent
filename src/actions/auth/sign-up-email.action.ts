"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ErrorCode } from "@/types/error-code";
import { headers } from "next/headers";

export const signUpEmailAction = async (data: {
	name: string;
	surname: string;
	email: string;
	password: string;
}) => {
	const existing = await prisma.user.findUnique({
		where: { email: data.email },
	});

	if (existing) {
		return {
			success: false,
			code: ErrorCode.USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL,
		};
	}

	try {
		await auth.api.signUpEmail({
			body: {
				name: data.name,
				surname: data.surname,
				email: data.email,
				password: data.password,
			},
			headers: await headers(),
		});

		return { success: true };
	} catch (err) {
		return { success: false, code: ErrorCode.INTERNAL_ERROR };
	}
};
