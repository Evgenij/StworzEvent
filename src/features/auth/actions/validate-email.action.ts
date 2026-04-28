"use server";

import prisma from "@/lib/prisma";
import { ErrorCode } from "@/types/error-code";

export const validateEmailAction = async (email: string, password: string) => {
	if (!email) return { success: false, code: ErrorCode.VALIDATION_ERROR };
	if (!password) return { success: false, code: ErrorCode.VALIDATION_ERROR };

	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) return { success: false, code: ErrorCode.USER_NOT_FOUND };

	return { success: true };
};
