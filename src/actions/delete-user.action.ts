"use server";
import { ADMIN_DASHBOARD_ROUTE } from "@/helpers/routes";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { ActionResult } from "@/types/action-result";
import { fail, handleActionError, success } from "@/lib/action-utils";

export async function deleteUserAction({
	userId,
}: {
	userId: string;
}): Promise<ActionResult> {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session) return fail("Unauthorized");
	if (session.user.role !== "ADMIN" || session.user.id === userId)
		return fail("Forbidden");

	try {
		await prisma.user.delete({ where: { id: userId, role: "USER" } });
		revalidatePath(ADMIN_DASHBOARD_ROUTE);
		return success(null);
	} catch (error: any) {
		return handleActionError(error);
	}
}
