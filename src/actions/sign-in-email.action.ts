"use server";
import { auth } from "@/lib/auth";
import { APIError } from "better-auth";
import { headers } from "next/headers";

export async function signInEmailAction(formData: FormData) {
	const email = formData.get("email") as string;
	if (!email) return { message: "Email is required" };

	const password = formData.get("password") as string;
	if (!password) return { message: "Password is required" };

	try {
		await auth.api.signInEmail({
			body: { email, password },
			headers: await headers(),
		});

		// const setCookieHeader = res.headers.get("set-cookie");
		// if (setCookieHeader) {
		// 	const cookie = parseSetCookieHeader(setCookieHeader);
		// 	const cookieStore = await cookies();

		// 	const [key, cookieAttributes] = [...cookie.entries()][0];
		// 	const value = cookieAttributes.value;
		// 	const maxAge = cookieAttributes.maxAge ?? undefined;
		// 	const path = cookieAttributes.path;
		// 	const httpOnly = cookieAttributes.httponly;
		// 	const sameSite = cookieAttributes.samesite;

		// 	cookieStore.set(key, decodeURIComponent(value), {
		// 		maxAge,
		// 		path,
		// 		httpOnly,
		// 		sameSite,
		// 	});
		// }

		return { message: null };
	} catch (error: any) {
		if (error instanceof APIError) {
			return { message: error.message };
		}

		return { message: "Internal Server Error" };
	}
}
