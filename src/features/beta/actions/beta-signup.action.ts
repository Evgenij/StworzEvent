"use server";

import { z } from "zod";
import resend from "@/lib/resend";
import { betaSignupNotificationMail } from "@/helpers/mail-templates";
import { APP_CONFIG } from "@/config/app";

const betaSignupSchema = z.object({
	email: z.string().email("Nieprawidłowy adres email"),
	name: z.string().min(2, "Imię jest wymagane"),
	surname: z.string().min(2, "Nazwisko jest wymagane"),
	company: z.string().optional(),
});

export type BetaSignupInput = z.infer<typeof betaSignupSchema>;
export type BetaSignupResult =
	| { success: true }
	| { success: false; error: string };

export async function betaSignupAction(
	input: BetaSignupInput,
): Promise<BetaSignupResult> {
	const parsed = betaSignupSchema.safeParse(input);
	if (!parsed.success) {
		const firstError = Object.values(
			parsed.error.flatten().fieldErrors,
		)[0]?.[0];
		return {
			success: false,
			error: firstError ?? "Nieprawidłowe dane formularza.",
		};
	}

	const { email, name, surname, company } = parsed.data;

	const notificationEmail = process.env.BETA_SIGNUP_NOTIFICATION_EMAIL;
	if (!notificationEmail) {
		console.error(
			"[betaSignupAction] BETA_SIGNUP_NOTIFICATION_EMAIL is not set",
		);
		return { success: true };
	}

	const { error } = await resend.emails.send({
		from: APP_CONFIG.email.fullSender,
		to: notificationEmail,
		replyTo: email,
		subject: `Beta signup: ${name} ${surname}`,
		html: betaSignupNotificationMail({ name, surname, email, company }),
	});

	if (error) {
		console.error("[betaSignupAction] resend error", { error, email });
	}

	return { success: true };
}
