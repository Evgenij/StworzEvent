"use server";
import { handleActionError } from "@/lib/action-utils";
import { auth } from "@/lib/auth";
import { APIError, success } from "better-auth";
import { headers } from "next/headers";

export async function signInEmailAction(formData: FormData) {
	const email = formData.get("email") as string;
	if (!email) return handleActionError(new Error("Email is required"));

	const password = formData.get("password") as string;
	if (!password) return handleActionError(new Error("Password is required"));

	try {
		await auth.api.signInEmail({
			body: { email, password },
			headers: await headers(),
		});
		return { success: true };
	} catch (error: any) {
		return handleActionError(error);
	}
}
