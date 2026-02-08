"use client";
import { useTranslations } from "next-intl";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "#/components/header/header";
import { Button } from "@/shadcn/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/shadcn/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
	InputGroupTextarea,
} from "@/shadcn/ui/input-group";
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
	PROFILE_ROUTE,
	SIGNUP_ROUTE,
} from "@/helpers/routes";
import { Spinner } from "@/shadcn/ui/spinner";
import { Link } from "@/i18n/routing";
import { signInEmailAction } from "@/actions/auth/sign-in-email.action";
import { toast } from "sonner";
import SignInOAuthBtn from "#/components/sign-in-oauth-btn";
import { Switch } from "@/shadcn/ui/switch";
import { signIn } from "@/lib/auth-client";
import { getBaseUrl } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shadcn/ui/tooltip";

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
					email: z.string().email(tErrors("invalidEmail")),
					password: z.string().optional(),
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
		// Do something with the form values.
		setIsPending(true);

		startTransition(async () => {
			// Создаем FormData из валидных данных
			const formData = new FormData();

			formData.append("email", data.email);
			if (data.password) formData.append("password", data.password);

			if (useMagicLink) {
				await signIn.magicLink({
					email: data.email,
					name: data.email.split("@")[0],
					callbackURL: `${getBaseUrl()}${PROFILE_ROUTE}`,
					fetchOptions: {
						onError(error) {
							toast.success(error.error.message);
						},
						onSuccess: () => {
							toast.success("Email is sent");
							//if (ref.current) ref.current.open = false;
						},
					},
				});
			} else {
				const result = await signInEmailAction(formData);

				if (result.success === false) {
					// 1. Показываем общий Toast
					if (result.message) toast.error(result.message);

					// 2. Раскидываем ошибки по полям формы
					// if (result.errors) {
					// 	Object.entries(result.errors).forEach(
					// 		([field, messages]) => {
					// 			form.setError(field as keyof FormValues, {
					// 				type: "server",
					// 				message: messages[0], // Берем первую ошибку из массива
					// 			});
					// 		},
					// 	);
					// }
				} else {
					toast.success("Zalogowano!");
					router.push(PROFILE_ROUTE);
				}
			}

			setIsPending(false);
		});
	};

	const handleChangeMagicLink = (checked: boolean) => {
		setUseMagicLink(checked);
		form.resetField("password");
	};

	return (
		<div className="flex flex-col gap-8">
			<header className="flex flex-col gap-3 items-center">
				<Header as={"h2"}>{t("title")}</Header>
			</header>
			<main className="flex flex-col gap-4">
				<div className="oauth-btns flex flex-col gap-2">
					<SignInOAuthBtn provider="google"></SignInOAuthBtn>
					<SignInOAuthBtn provider="facebook"></SignInOAuthBtn>
				</div>
				<div className="flex gap-3 items-center text-muted-foreground text-sm">
					<div className="h-[1px] w-full bg-muted"></div>
					<span>{tAuth("divider")}</span>
					<div className="h-[1px] w-full bg-muted"></div>
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
								handleChangeMagicLink(checked)
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
