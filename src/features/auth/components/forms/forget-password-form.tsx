"use client";
import { useTranslations } from "next-intl";
import { Button } from "@/components/shadcn/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/shadcn/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/shadcn/ui/input-group";
import { IconMail } from "@tabler/icons-react";
import { startTransition, useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import {
	AUTH_VERIFY_ROUTE,
	AUTH_VERIFY_SUCCESS_ROUTE,
	FORGOT_PASSWORD_SUCCESS_ROUTE,
	RESET_PASSWORD_ROUTE,
	SIGNIN_ROUTE,
} from "@/helpers/routes";
import { Spinner } from "@/components/shadcn/ui/spinner";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Typography from "@/components/shared/typography/typography";

export default function ForgetPasswordForm() {
	const t = useTranslations("ForgetPasswordForm");
	const tErrors = useTranslations("Errors");
	const tAuth = useTranslations("Auth");
	const router = useRouter();
	const [isPending, setIsPending] = useState(false);

	const formSchema = z.object({
		email: z.string().email(tErrors("invalidEmail")),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		// Do something with the form values.
		setIsPending(true);

		startTransition(async () => {
			// Создаем FormData из валидных данных
			const formData = new FormData();

			formData.append("email", data.email);

			await authClient.requestPasswordReset({
				email: data.email,
				redirectTo: RESET_PASSWORD_ROUTE,
				fetchOptions: {
					onRequest: () => {
						setIsPending(true);
					},
					onResponse: () => {
						setIsPending(false);
					},
					onError: (err) => {
						setIsPending(false);
						toast.error(tErrors("errorOfReset"));
					},
					onSuccess: () => {
						// toast.success(
						// 	"Link do resetowania hasła został wysłany na adres e-mail.",
						// );
						router.push(FORGOT_PASSWORD_SUCCESS_ROUTE);
					},
				},
			});
		});
	};

	async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsPending(true);
		const formData = new FormData(event.target as HTMLFormElement);

		const email = String(formData.get("email"));

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
					// toast.success(
					// 	"Link do resetowania hasła został wysłany na adres e-mail.",
					// );
					router.push(FORGOT_PASSWORD_SUCCESS_ROUTE);
				},
			},
		});
	}

	return (
		<div className="flex flex-col gap-9">
			<header className="flex flex-col gap-3 items-center">
				<Typography variant="h2" className="text-center">
					{t("title")}
				</Typography>
				<p className="text-muted-foreground text-center text-sm">
					{t.rich("subtitle", {
						lineBreak: () => <br />,
						important: (chunks) => (
							<span className="text-primary font-bold">
								{chunks}
							</span>
						),
					})}
				</p>
			</header>

			<main className="flex flex-col gap-4">
				<form
					id="forget-password-form"
					className="flex flex-col gap-4"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<FieldGroup>
						<Controller
							name="email"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<InputGroup>
										<InputGroupInput
											{...field}
											aria-invalid={fieldState.invalid}
											placeholder={tAuth(
												"placeholders.mail",
											)}
											type="email"
											name={field.name}
											autoComplete="on"
										/>
										<InputGroupAddon>
											<IconMail />
										</InputGroupAddon>
									</InputGroup>
									{fieldState.invalid && (
										<FieldError
											errors={[fieldState.error]}
										/>
									)}
								</Field>
							)}
						/>
					</FieldGroup>

					<Button
						type="submit"
						size={"lg"}
						className="w-full"
						disabled={isPending}
					>
						{isPending && <Spinner />}
						{t("button")}
					</Button>
					<p className="text-muted-foreground text-sm text-center">
						{t("rememberPassword")}{" "}
						<Link href={SIGNIN_ROUTE} className="link-default">
							{t("signIn")}
						</Link>
					</p>
				</form>
			</main>
		</div>
	);
}
