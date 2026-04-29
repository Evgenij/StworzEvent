"use client";

import { DASHBOARD_ROUTE } from "@/config/routes";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import FacebookIcon from "@/assets/icons/facebook.svg";
import GoogleIcon from "@/assets/icons/google.svg";
import { useTranslations } from "next-intl";
import { getBaseUrl } from "@/lib/utils";
import { IconLoader } from "@tabler/icons-react";

interface Props {
	provider: "facebook" | "google";
	signUp?: boolean;
}

function SignInOAuthBtn({ provider, signUp }: Props) {
	const tAuth = useTranslations("Auth");
	const [isPending, setIsPending] = useState(false);
	const providerName = provider.replace(/\b\w/g, (char) =>
		char.toUpperCase(),
	);

	const handleClick = async () => {
		await signIn.social({
			provider,
			// callbackURL: DASHBOARD_ROUTE,
			callbackURL: `${getBaseUrl()}${DASHBOARD_ROUTE}`,
			// errorCallbackURL: AUTH_ERROR_ROUTE, //TODO create page with error of auth
			fetchOptions: {
				onRequest() {
					setIsPending(true);
				},
				onError: (ctx) => {
					setIsPending(false);
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
			{isPending ? (
				<IconLoader className="size-5 animate-spin" />
			) : provider === "facebook" ? (
				<img src={FacebookIcon.src} height={20} width={20}></img>
			) : (
				<img src={GoogleIcon.src} height={18} width={18}></img>
			)}
			{tAuth("oauth")} {providerName}
		</Button>
	);
}

export default SignInOAuthBtn;
