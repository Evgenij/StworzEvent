"use client";
import { useTranslations } from "next-intl";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/shadcn/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
} from "@/components/shadcn/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/shadcn/ui/input-group";
import {
	IconEye,
	IconEyeClosed,
	IconInfoCircle,
	IconInfoCircleFilled,
	IconLock,
	IconMail,
} from "@tabler/icons-react";
import { startTransition, useMemo, useState } from "react";
import { useRouter } from "@/i18n/routing";
import {
	FORGET_PASSWORD_ROUTE,
	DASHBOARD_ROUTE,
	SIGNUP_ROUTE,
	MAIN_PAGE_ROUTE,
} from "@/consts/routes";
import { Spinner } from "@/components/shadcn/ui/spinner";
import { Link } from "@/i18n/routing";
import { signInEmailAction } from "@/actions/auth/sign-in-email.action";
import { toast } from "sonner";
import SignInOAuthBtn from "@/features/auth/components/sign-in-oauth-btn";
import { Switch } from "@/components/shadcn/ui/switch";
import { signIn } from "@/lib/auth-client";
import { getBaseUrl } from "@/lib/utils";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/shadcn/ui/tooltip";
import { ErrorCode } from "@/types/error-code";
import { validateEmailAction } from "@/actions/auth/validate-email.action";
import { Typography } from "@/components/shared";

export default function SignInForm() {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [isPending, setIsPending] = useState(false);
	const [useMagicLink, setUseMagicLink] = useState(false);

	const t = useTranslations("SignInForm");
	const tErrors = useTranslations("Errors");
	const tAuth = useTranslations("Auth");

	const formSchema = useMemo(
		() =>
			z
				.object({
					email: z
						.string()
						.min(1, { message: tErrors("emailRequired") })
						.trim()
						.email(tErrors("invalidEmail"))
						.trim(),
					password: z.string().trim().optional(),
				})
				.refine(
					(data) => {
						if (!useMagicLink) {
							return !!(
								data.password && data.password.length >= 6
							);
						}
						return true;
					},
					{
						message: tErrors("passwordMin"),
						path: ["password"],
					},
				)
				.refine(
					(data) => {
						if (!useMagicLink) {
							return !!(
								data.password && data.password.length <= 25
							);
						}
						return true;
					},
					{
						message: tErrors("passwordMax"),
						path: ["password"],
					},
				),

		[useMagicLink],
	); // Схема пересчитается, когда изменится useMagicLink

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
		context: { useMagicLink },
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		if (isPending) return;

		// Do something with the form values.
		setIsPending(true);

		startTransition(async () => {
			try {
				if (useMagicLink) {
					// Magic Link — отдельная логика (не через ActionResult)
					const { error } = await signIn.magicLink({
						email: data.email,
						name: data.email.split("@")[0] || "User",
						callbackURL: `${getBaseUrl()}${DASHBOARD_ROUTE}`,
					});

					if (error) {
						toast.error(
							error.message || tErrors("magicLinkFailed"),
						);
					} else {
						toast.success(t("magicLinkSent"));
						// Можно показать модалку / текст "проверьте почту"
					}
				} else {
					// Обычный email + password
					form.clearErrors();
					// 1. Валидация через server action (без signIn)
					const validation = await validateEmailAction(
						data.email,
						data.password!,
					);

					if (!validation.success) {
						if (validation.code === ErrorCode.USER_NOT_FOUND) {
							form.setError("email", {
								type: "manual",
								message: tErrors("auth.USER_NOT_FOUND"),
							});
						} else if (
							validation.code === ErrorCode.VALIDATION_ERROR
						) {
							toast.error(tErrors("auth.default"));
						}
						return;
					}

					// 2. Авторизация через клиент (куки устанавливаются корректно)
					const { error } = await signIn.email({
						email: data.email,
						password: data.password!,
						callbackURL: `${getBaseUrl()}${MAIN_PAGE_ROUTE}`,
					});

					if (error) {
						if (error.code === "INVALID_EMAIL_OR_PASSWORD") {
							form.setError("password", {
								type: "manual",
								message: tErrors("auth.INVALID_PASSWORD"),
							});
						} else {
							toast.error(tErrors("auth.default"));
						}
					} else {
						toast.success(t("loginSuccess"));
					}
				}
			} catch (error) {
				console.error("Sign in error:", error);
				toast.error(tErrors("unexpectedError"));
			} finally {
				setIsPending(false);
			}
		});
	};

	const handleMagicLinkToggle = (checked: boolean) => {
		setUseMagicLink(checked);
		if (checked) {
			form.resetField("password");
			form.clearErrors("password");
		}
	};

	return (
		<div className="flex flex-col gap-8">
			<header className="flex flex-col gap-3 items-center">
				<Typography variant="h2" className="text-center">
					{t("title")}
				</Typography>
			</header>
			<main className="flex flex-col gap-4">
				<div className="oauth-btns flex flex-col gap-2">
					<SignInOAuthBtn provider="google"></SignInOAuthBtn>
					<SignInOAuthBtn provider="facebook"></SignInOAuthBtn>
				</div>
				<div className="flex gap-3 items-center text-muted-foreground text-sm">
					<div className="h-px w-full bg-muted"></div>
					<span>{tAuth("divider")}</span>
					<div className="h-px w-full bg-muted"></div>
				</div>
				{/* <pre className="w-full">{JSON.stringify(form, null, 2)}</pre> */}

				<form
					id="sign-in-form"
					className="flex flex-col gap-4"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<div className="magic-link flex items-center gap-2">
						<Switch
							id="magic-link"
							checked={useMagicLink}
							onCheckedChange={(checked) =>
								handleMagicLinkToggle(checked)
							}
						/>
						<label
							htmlFor="magic-link"
							className="flex items-center gap-2 cursor-pointer text-sm"
						>
							{t("useMagicLink")}
							<Tooltip>
								<TooltipTrigger asChild>
									<IconInfoCircleFilled className="cursor-help size-5 text-gray-400 hover:text-blue-600" />
								</TooltipTrigger>
								<TooltipContent>
									<p>
										Szybkie logowanie przez e-mail bez
										wpisywania hasła.
									</p>
								</TooltipContent>
							</Tooltip>
						</label>
					</div>
					<FieldGroup>
						<Controller
							name="email"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<InputGroup>
										<InputGroupAddon>
											<IconMail />
										</InputGroupAddon>
										<InputGroupInput
											{...field}
											id={field.name}
											name={field.name}
											aria-invalid={fieldState.invalid}
											placeholder={tAuth(
												"placeholders.mail",
											)}
											autoComplete="on"
											type="email"
										/>
									</InputGroup>
									{fieldState.invalid && (
										<FieldError
											errors={[fieldState.error]}
										/>
									)}
								</Field>
							)}
						/>
						{!useMagicLink && (
							<div className="password flex flex-col gap-1">
								<Controller
									name="password"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field
											data-invalid={fieldState.invalid}
										>
											<InputGroup>
												<InputGroupInput
													{...field}
													id={field.name}
													aria-invalid={
														fieldState.invalid
													}
													placeholder={tAuth(
														"placeholders.password",
													)}
													type={
														showPassword
															? "text"
															: "password"
													}
													name={field.name}
												/>
												<InputGroupAddon>
													<IconLock />
												</InputGroupAddon>
												<InputGroupAddon
													align={"inline-end"}
													className="cursor-pointer"
													onClick={() =>
														setShowPassword(
															!showPassword,
														)
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
								<FieldDescription className="ml-3">
									<Link
										href={FORGET_PASSWORD_ROUTE}
										className="link-default simple-text"
									>
										{t("forgotPassword")}
									</Link>
								</FieldDescription>
							</div>
						)}
					</FieldGroup>
					<Button
						type="submit"
						size={"lg"}
						className="w-full"
						disabled={isPending}
						form="sign-in-form"
					>
						{isPending && <Spinner />}
						{useMagicLink
							? t("button.magicLink")
							: t("button.signIn")}
					</Button>
					<p className="text-muted-foreground text-sm text-center">
						{t("no-account")}{" "}
						<Link href={SIGNUP_ROUTE} className="link-default">
							{t("signUp")}
						</Link>
					</p>
				</form>
			</main>
		</div>
	);
}
