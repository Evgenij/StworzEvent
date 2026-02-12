"use client";
import { useTranslations } from "next-intl";
import { Button } from "@/shadcn/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shadcn/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/shadcn/ui/input-group";
import {
	IconAlertTriangleFilled,
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
	FORGET_PASSWORD_ROUTE,
	POLITICS_ROUTE,
	SIGNIN_ROUTE,
} from "@/helpers/routes";
import { Spinner } from "@/shadcn/ui/spinner";
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
import { Switch } from "@/shadcn/ui/switch";
import { Checkbox } from "@/shadcn/ui/checkbox";

type SignUpSpecProps = {
	name: string;
	email: string;
};

export default function SignUpSpecForm({ email, name }: SignUpSpecProps) {
	const t = useTranslations("SignUpSpecForm");
	const tErrors = useTranslations("Errors");
	const router = useRouter();
	const [isPending, setIsPending] = useState(false);
	const [sendingPassword, setSendingPassword] = useState(false);
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
			// await authClient.resetPassword({
			// 	newPassword: data.confirmPassword,
			// 	token: token,

			// 	fetchOptions: {
			// 		onRequest: () => {
			// 			setIsPending(true);
			// 		},
			// 		onResponse: () => {
			// 			setIsPending(false);
			// 		},
			// 		onError: (ctx) => {
			// 			setIsPending(false);
			// 			// Better-auth возвращает объект контекста, где ошибка лежит в ctx.error
			// 			console.log(ctx.error);
			// 			const errorCode = ctx.error.code; // Например: 'INVALID_TOKEN'
			// 			const message =
			// 				tErrors(`auth.${errorCode}`) ||
			// 				tErrors("auth.default");

			// 			if (errorCode === "INVALID_TOKEN") {
			// 				setTokenIsInvalid(true);
			// 				// toast.error(message, {
			// 				// 	description:
			// 				// 		"Możesz otrzymać nowy link do resetowania hasła.",
			// 				// 	action: {
			// 				// 		label: "Wyślij ponownie",
			// 				// 		onClick: () =>
			// 				// 			router.push(FORGET_PASSWORD_ROUTE),
			// 				// 	},
			// 				// 	classNames: {
			// 				// 		description: "!text-foreground/70",
			// 				// 	},
			// 				// });
			// 			} else toast.error(message);
			// 		},
			// 		onSuccess: () => {
			// 			toast.success(t("successMessage"));
			// 			router.push(SIGNIN_ROUTE);
			// 		},
			// 	},
			// });

			setIsPending(false);
		});
	};

	return (
		<div className="flex flex-col gap-9">
			<header className="flex flex-col gap-3 items-center">
				<Header as={"h2"} className="text-center">
					{name ? `${name}, ` : ""}
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
				{email}
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
										<div className="flex gap-1 group items-center text-sm text-muted-foreground cursor-pointer">
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
					<div className="magic-link flex items-center gap-2">
						<Checkbox
							id="send-password"
							checked={sendingPassword}
							onCheckedChange={(checked) =>
								setSendingPassword(!!checked)
							}
						/>
						<label
							htmlFor="send-password"
							className="flex items-center gap-2 cursor-pointer text-sm"
						>
							{t("sendPassword")}
						</label>
					</div>

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
