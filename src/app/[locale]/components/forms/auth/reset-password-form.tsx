"use client";
import { useTranslations } from "next-intl";
import { Button } from "@/shadcn/ui/button";
import { FieldGroup } from "@/shadcn/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/shadcn/ui/input-group";
import {
	IconEye,
	IconEyeClosed,
	IconLock,
	IconMail,
} from "@tabler/icons-react";
import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import {
	AUTH_VERIFY_ROUTE,
	AUTH_VERIFY_SUCCESS_ROUTE,
	FORGOT_PASSWORD_SUCCESS_ROUTE,
	RESET_PASSWORD_ROUTE,
	SIGNIN_ROUTE,
} from "@/helpers/routes";
import { Spinner } from "@/shadcn/ui/spinner";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function ResetPasswordForm({ token }: { token: string }) {
	const t = useTranslations("SignInForm"); //  TODO !!!
	const router = useRouter();
	const [isPending, setIsPending] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);

		const passwordInit = String(formData.get("passwordInit"));
		const password = String(formData.get("password"));

		if (!password) return toast.error("Brak wartosci hasla");
		if (passwordInit !== password)
			return toast.error("Hasla nie sa identyczne");

		await authClient.resetPassword({
			newPassword: password,
			token: token,
			fetchOptions: {
				onRequest: () => {
					setIsPending(true);
				},
				onResponse: () => {
					setIsPending(false);
				},
				onError: (err) => {
					setIsPending(false);
					toast.error("Wystąpił błąd! Spróbuj ponownie.");
				},
				onSuccess: () => {
					toast.success("Haslo zostalo zmienione!");
					router.push(SIGNIN_ROUTE); // TODO route to profile
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
							placeholder="wpisz haslo"
							type={showPassword ? "text" : "password"}
							name="passwordInit"
						/>
						<InputGroupAddon>
							<IconLock />
						</InputGroupAddon>
						<InputGroupAddon
							align={"inline-end"}
							className="cursor-pointer"
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? <IconEyeClosed /> : <IconEye />}
						</InputGroupAddon>
					</InputGroup>
					<InputGroup>
						<InputGroupInput
							placeholder="powtorz haslo"
							type="password"
							name="password"
						/>
						<InputGroupAddon>
							<IconLock />
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
					Save password
				</Button>
			</form>
		</div>
	);
}
