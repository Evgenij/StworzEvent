"use client";
import { useTranslations } from "next-intl";
import { Button } from "@/shadcn/ui/button";
import { Field, FieldError, FieldGroup } from "@/shadcn/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/shadcn/ui/input-group";
import {
	IconAlertTriangleFilled,
	IconEye,
	IconEyeClosed,
	IconInfoCircleFilled,
	IconLock,
	IconLockCheck,
	IconMail,
} from "@tabler/icons-react";
import { startTransition, useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import {
	AUTH_VERIFY_ROUTE,
	AUTH_VERIFY_SUCCESS_ROUTE,
	FORGET_PASSWORD_ROUTE,
	DASHBOARD_ROUTE,
	SIGNIN_ROUTE,
} from "@/helpers/routes";
import { Spinner } from "@/shadcn/ui/spinner";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Header } from "../../header/header";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
	Alert,
	AlertAction,
	AlertDescription,
	AlertTitle,
} from "@/shadcn/ui/alert";

export default function ResetPasswordForm({ token }: { token: string }) {
	const t = useTranslations("ResetPasswordForm");
	const tErrors = useTranslations("Errors");
	const router = useRouter();
	const [isPending, setIsPending] = useState(false);
	const [tokenIsInvalid, setTokenIsInvalid] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const formSchema = z
		.object({
			password: z
				.string()
				.min(6, tErrors("passwordMin")) //TODO create global variables for validation
				.max(25, tErrors("passwordMax")),
			confirmPassword: z.string(),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: tErrors("passwordsDontMatch"),
			path: ["confirmPassword"],
		});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	// 1. Получаем значения полей для сравнения
	const password = form.watch("password");
	const confirmPassword = form.watch("confirmPassword");

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		startTransition(async () => {
			await authClient.resetPassword({
				newPassword: data.confirmPassword,
				token: token,

				fetchOptions: {
					onRequest: () => {
						setIsPending(true);
					},
					onResponse: () => {
						setIsPending(false);
					},
					onError: (ctx) => {
						setIsPending(false);
						// Better-auth возвращает объект контекста, где ошибка лежит в ctx.error
						console.log(ctx.error);
						const errorCode = ctx.error.code; // Например: 'INVALID_TOKEN'
						const message =
							tErrors(`auth.${errorCode}`) ||
							tErrors("auth.default");

						if (errorCode === "INVALID_TOKEN") {
							setTokenIsInvalid(true);
							// toast.error(message, {
							// 	description:
							// 		"Możesz otrzymać nowy link do resetowania hasła.",
							// 	action: {
							// 		label: "Wyślij ponownie",
							// 		onClick: () =>
							// 			router.push(FORGET_PASSWORD_ROUTE),
							// 	},
							// 	classNames: {
							// 		description: "!text-foreground/70",
							// 	},
							// });
						} else toast.error(message);
					},
					onSuccess: () => {
						toast.success(t("successMessage"));
						router.push(SIGNIN_ROUTE);
					},
				},
			});

			setIsPending(false);
		});
	};

	return (
		<div className="flex flex-col gap-9">
			<header className="flex flex-col gap-3 items-center">
				<Header as={"h2"} className="text-center">
					{t("title")}
				</Header>
				<p className="text-muted-foreground text-center text-sm">
					{t.rich("subtitle", {
						lineBreak: () => <br />,
						// Можно даже стилизовать части текста:
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
					id="reset-password-form"
					className="flex flex-col gap-4"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<FieldGroup>
						<Controller
							name="password"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<InputGroup>
										<InputGroupInput
											{...field}
											aria-invalid={fieldState.invalid}
											placeholder={t("fields.password")}
											disabled={tokenIsInvalid}
											type={
												showPassword
													? "text"
													: "password"
											}
											name="password"
										/>
										<InputGroupAddon>
											<IconLock />
										</InputGroupAddon>
										<InputGroupAddon
											align={"inline-end"}
											className="cursor-pointer"
											onClick={() =>
												setShowPassword(!showPassword)
											}
										>
											{showPassword ? (
												<IconEyeClosed />
											) : (
												<IconEye />
											)}
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
						<Controller
							name="confirmPassword"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<InputGroup>
										<InputGroupInput
											{...field}
											aria-invalid={fieldState.invalid}
											placeholder={t(
												"fields.confirmPassword",
											)}
											type="password"
											name="confirmPassword"
											disabled={tokenIsInvalid}
										/>
										<InputGroupAddon>
											<IconLockCheck
												className={cn(
													"transition-colors",
													!fieldState.invalid &&
														fieldState.isDirty &&
														password ===
															confirmPassword &&
														password !== "" // Проверяем совпадение
														? "text-green-600"
														: "text-muted-foreground",
												)}
											/>
										</InputGroupAddon>
										<InputGroupAddon
											align={"inline-end"}
											className="cursor-pointer"
											onClick={() =>
												setShowPassword(!showPassword)
											}
										></InputGroupAddon>
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

					{tokenIsInvalid && (
						<Alert variant="destructive">
							<IconAlertTriangleFilled />
							<AlertTitle>
								{tErrors("auth.INVALID_TOKEN")}
							</AlertTitle>
							<AlertDescription>
								{t("resendLink.text")}
							</AlertDescription>
							<AlertAction>
								<Button
									type="button"
									variant="secondary"
									onClick={() =>
										router.push(FORGET_PASSWORD_ROUTE)
									}
								>
									{t("resendLink.button")}
								</Button>
							</AlertAction>
						</Alert>
					)}

					<Button
						type="submit"
						size={"lg"}
						className="w-full"
						disabled={isPending || tokenIsInvalid}
					>
						{isPending && <Spinner />}
						{t("button")}
					</Button>
					<p className="text-muted-foreground text-sm text-center">
						{t("backToLogin")}{" "}
						<Link href={SIGNIN_ROUTE} className="link-default">
							{t("signIn")}
						</Link>
					</p>
				</form>
			</main>
		</div>
	);
}
