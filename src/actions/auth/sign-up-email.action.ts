"use server";

import { auth } from "@/lib/auth";
import { safeAction } from "@/lib/safe-action";
import { headers } from "next/headers";

export const signUpEmailAction = safeAction(
	async (data: {
		name: string;
		surname: string;
		email: string;
		password: string;
	}) => {
		await auth.api.signUpEmail({
			body: {
				name: data.name,
				surname: data.surname,
				email: data.email,
				password: data.password,
			},
			headers: await headers(),
		});
	},
);
