"use client";

import { AUTH_ERROR_ROUTE, PROFILE_ROUTE } from "@/helpers/routes";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/shadcn/ui/button";
import React, { useState } from "react";
import { toast } from "sonner";
import FacebookIcon from "@/assets/icons/facebook.svg";
import GoogleIcon from "@/assets/icons/google.svg";
import { useTranslations } from "next-intl";

interface Props {
	provider: "facebook" | "google";
	signUp?: boolean;
}

function SignInOAuthBtn({ provider, signUp }: Props) {
	const t = useTranslations("SignInForm");
	const [isPending, setIsPending] = useState(false);
	const action = signUp ? "Up" : "In";
	const providerName = provider.replace(/\b\w/g, (char) =>
		char.toUpperCase(),
	);

	const handleClick = async () => {
		await signIn.social({
			provider,
			callbackURL: PROFILE_ROUTE,
			errorCallbackURL: AUTH_ERROR_ROUTE, //TODO create page with error of auth
			fetchOptions: {
				onRequest() {
					setIsPending(true);
				},
				onResponse() {
					setIsPending(false);
				},
				onError: (ctx) => {
					toast.error(ctx.error.message);
				},
			},
		});
	};

	return (
		<Button
			variant={"outline"}
			type="button"
			disabled={isPending}
			onClick={handleClick}
			className="w-full"
			size={"lg"}
		>
			{provider === "facebook" ? (
				<img src={FacebookIcon.src} height={20} width={20}></img>
			) : (
				<img src={GoogleIcon.src} height={18} width={18}></img>
			)}
			{t("oauth")} {providerName}
		</Button>
	);
}

export default SignInOAuthBtn;
