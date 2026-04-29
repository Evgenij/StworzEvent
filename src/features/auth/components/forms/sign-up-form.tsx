"use client";
import { useTranslations } from "next-intl";
import { MIN_PASSWORD_LENGTH } from "@/config/validation";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	IconEye,
	IconEyeClosed,
	IconLock,
	IconMail,
	IconUser,
} from "@tabler/icons-react";
import { startTransition, useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import {
	CONDITIONALS_ROUTE,
	POLITICS_ROUTE,
	DASHBOARD_ROUTE,
	SIGNIN_ROUTE,
} from "@/config/routes";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import SignInOAuthBtn from "@/features/auth/components/sign-in-oauth-btn";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorCode } from "@/types/error-code";
import { signIn } from "@/lib/auth-client";
import { Typography } from "@/shared/components";
import { signUpEmailAction } from "../../actions/sign-up-email.action";

export default function SignUpForm() {
	const t = useTranslations("SignUpForm");
	const tAuth = useTranslations("Auth");
	const tErrors = useTranslations("Errors");
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();
	const [isPending, setIsPending] = useState(false);

	const formSchema = z.object({
		user: z.object({
			name: z.string().min(2, tErrors("nameMin")),
			surname: z.string().min(2, tErrors("surnameMin")),
		}),
		email: z.email(tErrors("invalidEmail")),
		password: z
			.string()
			.min(MIN_PASSWORD_LENGTH, tErrors("passwordMin"))
			.max(25, tErrors("passwordMax")),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			user: {
				name: "",
				surname: "",
			},
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		setIsPending(true);

		startTransition(async () => {
			try {
				form.clearErrors();

				// 1. Регистрация через server action
				const result = await signUpEmailAction({
					name: data.user.name,
					surname: data.user.surname,
					email: data.email,
					password: data.password,
				});

				if (!result.success) {
					if (
						result.code ===
						ErrorCode.USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL
					) {
						form.setError("email", {
							type: "manual",
							message: tErrors(
								"auth.USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
							),
						});
					} else {
						toast.error(tErrors("auth.default"));
					}
					return;
				}

				// 2. Автологин через клиент (куки устанавливаются корректно)
				const { error } = await signIn.email({
					email: data.email,
					password: data.password,
					callbackURL: DASHBOARD_ROUTE,
				});

				if (error) {
					// Зарегистрировались, но логин не удался → на страницу входа
					toast.success(t("successMessage.header"));
					router.push(SIGNIN_ROUTE);
				} else {
					toast.success(t("successMessage.header"), {
						description: t("successMessage.text"),
						classNames: { description: "!text-foreground/70" },
					});
				}
			} catch (error) {
				console.error("Sign up error:", error);
				toast.error(tErrors("unexpectedError"));
			} finally {
				setIsPending(false);
			}
		});
	};

	return (
		<div className="flex flex-col gap-9">
			<header className="flex flex-col gap-3 items-center">
				<Typography variant="h2" className="text-center">
					{t("title")}
				</Typography>
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
				<div className="oauth-btns flex flex-col gap-2">
					<SignInOAuthBtn provider="google"></SignInOAuthBtn>
					<SignInOAuthBtn provider="facebook"></SignInOAuthBtn>
				</div>
				<div className="flex gap-3 items-center text-muted-foreground text-sm">
					<div className="h-px w-full bg-muted"></div>
					<span>{tAuth("divider")}</span>
					<div className="h-px w-full bg-muted"></div>
				</div>
				<form
					id="sign-up-form"
					className="flex flex-col gap-4"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<FieldGroup>
						<div className="flex gap-2">
							<Controller
								name="user.name"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<InputGroup>
											<InputGroupAddon>
												<IconUser />
											</InputGroupAddon>
											<InputGroupInput
												{...field}
												id="name"
												name="name"
												aria-invalid={
													fieldState.invalid
												}
												placeholder={tAuth(
													"placeholders.name",
												)}
												autoComplete="on"
												type="text"
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
							<Controller
								name="user.surname"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<InputGroup>
											<InputGroupInput
												{...field}
												id="surname"
												name="surname"
												aria-invalid={
													fieldState.invalid
												}
												placeholder={tAuth(
													"placeholders.surname",
												)}
												autoComplete="on"
												type="text"
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
						</div>
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
						<Controller
							name="password"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<InputGroup>
										<InputGroupInput
											{...field}
											aria-invalid={fieldState.invalid}
											placeholder={tAuth(
												"placeholders.password",
											)}
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
						{t("have-account")}{" "}
						<Link href={SIGNIN_ROUTE} className="link-default">
							{t("signIn")}
						</Link>
					</p>
					<p className="text-muted-foreground text-sm text-center">
						{t.rich("politics", {
							lineBreak: () => <br />,
							linkConditionals: (chunks) => (
								<Link
									href={CONDITIONALS_ROUTE}
									className="link-default underline"
								>
									{chunks}
								</Link>
							),
							politics: (chunks) => (
								<Link
									href={POLITICS_ROUTE}
									className="link-default underline"
								>
									{chunks}
								</Link>
							),
						})}
					</p>
				</form>
			</main>
		</div>
	);
}
