"use client";
import { useTranslations } from "next-intl";
import { Button } from "@/shadcn/ui/button";
import { FieldGroup } from "@/shadcn/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/shadcn/ui/input-group";
import { IconMail } from "@tabler/icons-react";
import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import {
	AUTH_VERIFY_ROUTE,
	AUTH_VERIFY_SUCCESS_ROUTE,
	FORGOT_PASSWORD_SUCCESS_ROUTE,
	RESET_PASSWORD_ROUTE,
} from "@/helpers/routes";
import { Spinner } from "@/shadcn/ui/spinner";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function ForgetPasswordForm() {
	const t = useTranslations("SignInForm"); //  TODO !!!
	const router = useRouter();
	const [isPending, setIsPending] = useState(false);

	async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsPending(true);
		const formData = new FormData(event.target as HTMLFormElement);

		const email = String(formData.get("email"));

		if (!email) return toast.error("Brak adresu email");

		await authClient.requestPasswordReset({
			email: email,
			redirectTo: RESET_PASSWORD_ROUTE,
			fetchOptions: {
				onRequest: () => {
					setIsPending(true);
				},
				onResponse: () => {
					setIsPending(false);

					// router.push(SIGNUP_ROUTE);
				},
				onError: (err) => {
					setIsPending(false);
					toast.error("Wystąpił błąd! Spróbuj ponownie.");
				},
				onSuccess: () => {
					toast.success(
						"Link do resetowania hasła został wysłany na adres e-mail.",
					);
					router.push(FORGOT_PASSWORD_SUCCESS_ROUTE);
				},
			},
		});
	}

	return (
		<div className="flex flex-col gap-10 w-full">
			<form
				action=""
				onSubmit={submitHandler}
				className="flex flex-col gap-3"
			>
				<FieldGroup>
					<InputGroup>
						<InputGroupInput
							placeholder="name@example.com"
							type="email"
							name="email"
						/>
						<InputGroupAddon>
							<IconMail />
						</InputGroupAddon>
					</InputGroup>
				</FieldGroup>

				<Button
					type="submit"
					size={"lg"}
					className="w-full"
					disabled={isPending}
				>
					{isPending && <Spinner />}
					{/* {t("button")} */}
					Wyślij link resetujący
				</Button>
			</form>
		</div>
	);
}
