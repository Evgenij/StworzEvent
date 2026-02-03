import React from "react";
import VerificationEmailForm from "../../components/forms/verification-email-form";
import { redirect } from "@/i18n/routing";
import { PROFILE_ROUTE } from "@/helpers/routes";

interface Props {
	searchParams: Promise<{ error: string }>;
	paramsLocale: { locale: string };
}

type AuthError = "email_verified" | "token_expired" | "invalid_token";
const errorMessages: Record<AuthError, string> = {
	email_verified: "Ten adres e-mail jest już aktywowany.",
	token_expired: "Link aktywacyjny stracił ważność. Wyślemy Ci nowy.",
	invalid_token: "Link aktywacyjny wygląda na nieprawidłowy.",
};

const VerifyPage = async ({ searchParams, paramsLocale }: Props) => {
	const sp = await searchParams;
	const { locale } = await paramsLocale;
	const error = (await searchParams).error;

	if (!error) redirect({ href: PROFILE_ROUTE, locale });

	return (
		<div className="flex flex-col items-center gap-6 max-w-[350px] w-full">
			<h1 className="h">VerifyPage</h1>
			<p className="text-destructive">
				{errorMessages[sp.error as AuthError] ||
					"Wystąpił nieoczekiwany błąd. Spróbuj ponownie później."}
			</p>
			<VerificationEmailForm />
		</div>
	);
};

export default VerifyPage;
