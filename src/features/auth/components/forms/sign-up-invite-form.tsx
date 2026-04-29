"use client";
import { useTranslations } from "next-intl";
import { MIN_PASSWORD_LENGTH } from "@/config/validation";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	IconAlertTriangleFilled,
	IconCircleCheckFilled,
	IconCopy,
	IconCopyCheck,
	IconCopyCheckFilled,
	IconCopyXFilled,
	IconEye,
	IconEyeClosed,
	IconLock,
	IconLockCheck,
	IconSparkles,
} from "@tabler/icons-react";
import { startTransition, useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import {
	CONDITIONALS_ROUTE,
	DASHBOARD_ROUTE,
	POLITICS_ROUTE,
} from "@/config/routes";
import { Spinner } from "@/components/ui/spinner";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { acceptInvitationAction } from "../../actions/accept-invitation.action";
import { signInEmailAction } from "../../actions/sign-in-email.action";
import { Typography } from "@/shared/components";

export default function SignUpInviteForm({ token }: { token: string }) {
	const t = useTranslations("SignUpInviteForm");
	const tErrors = useTranslations("Errors");
	const router = useRouter();
	const [isPending, setIsPending] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [tokenIsInvalid, setTokenIsInvalid] = useState(false);
	const [passwordIsCopied, setPasswordIsCopied] = useState(false);

	const formSchema = z
		.object({
			password: z
				.string()
				.min(MIN_PASSWORD_LENGTH, tErrors("passwordMin"))
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
		setIsPending(true);

		startTransition(async () => {
			try {
				const result = await acceptInvitationAction(
					token,
					data.confirmPassword,
				);

				if (!result.success) {
					if (
						result.code === "INVALID_TOKEN" ||
						result.code === "TOKEN_EXPIRED"
					) {
						setTokenIsInvalid(true);
						toast.error(tErrors(`auth.${result.code}`));
					} else if (
						result.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
					) {
						toast.error(tErrors("auth.userAlreadyExists"));
					} else {
						// другие коды или дефолт
						toast.error(
							tErrors("auth.default") || "Coś poszło nie tak",
						);
					}
					setIsPending(false);
					return;
				}

				// Успешная регистрация → сразу логиним
				const formData = new FormData();
				formData.append("email", result.data.user.email);
				formData.append("password", data.password);

				const signInResult = await signInEmailAction(formData);

				if (!signInResult.success) {
					toast.error(tErrors("auth.signInFailed"));
				} else {
					toast.success(t("successMessage.header"), {
						description: t("successMessage.text"),
						classNames: { description: "!text-foreground/70" },
					});
					router.push(DASHBOARD_ROUTE);
				}
			} catch (error) {
				console.log(error);
			}
		});
	};

	const generatePassword = () => {
		const array = new Uint8Array(16);
		crypto.getRandomValues(array);
		const password = btoa(String.fromCharCode(...array));
		form.setValue("password", password);
		form.setValue("confirmPassword", password, {
			shouldValidate: true,
			shouldDirty: true,
			shouldTouch: true,
		});
	};

	const copyPassword = () => {
		navigator.clipboard.writeText(password);
		setPasswordIsCopied(true);
		setTimeout(() => {
			setPasswordIsCopied(false);
		}, 3000);
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
									<div className="flex justify-between">
										<FieldLabel className="leading-0">
											Haslo
										</FieldLabel>
										<div
											className="flex gap-1 group items-center text-sm text-muted-foreground cursor-pointer"
											onClick={generatePassword}
										>
											<span className="group-hover:text-black">
												Wygenerować hasło
											</span>
											<IconSparkles
												size={20}
												className="group-hover:text-purple-500"
											/>
										</div>
									</div>

									<InputGroup>
										<InputGroupInput
											{...field}
											aria-invalid={fieldState.invalid}
											placeholder={t("fields.password")}
											type={
												showPassword
													? "text"
													: "password"
											}
											name="password"
											disabled={tokenIsInvalid}
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
									<FieldDescription
										className={cn(
											"flex items-center justify-end text-sm gap-1 cursor-pointer group",
											confirmPassword === "" &&
												"opacity-50 cursor-not-allowed",
										)}
										onClick={copyPassword}
									>
										{passwordIsCopied
											? t("successCopy")
											: t("copyPassword")}
										{passwordIsCopied ? (
											<IconCircleCheckFilled
												size={18}
												className="text-green-500"
											/>
										) : (
											<IconCopy
												size={18}
												className="group-hover:text-blue-500"
											/>
										)}
									</FieldDescription>
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
						{t.rich("politics", {
							lineBreak: () => <br />, // Добавь этот обработчик
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
