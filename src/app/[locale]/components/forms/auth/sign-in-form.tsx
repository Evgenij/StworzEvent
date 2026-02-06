"use client";
import { useTranslations } from "next-intl";
import { Header } from "#/components/header/header";
import { Button } from "@/shadcn/ui/button";
import { FieldDescription, FieldGroup } from "@/shadcn/ui/field";
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
	FORGOT_PASSWORD_ROUTE,
	PROFILE_ROUTE,
	SIGNUP_ROUTE,
} from "@/helpers/routes";
import { Spinner } from "@/shadcn/ui/spinner";
import { Link } from "@/i18n/routing";
import { signInEmailAction } from "@/actions/sign-in-email.action";
import { toast } from "sonner";
import SignInOAuthBtn from "#/components/sign-in-oauth-btn";
import { Switch } from "@/shadcn/ui/switch";

type SignInState = {
	email: string;
	auth: {
		useMagicLink: boolean;
		password?: string;
	};
};

export default function SignInForm() {
	const t = useTranslations("SignInForm");
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [isPending, setIsPending] = useState(false);
	const [useMagicLink, setUseMagicLink] = useState(false);
	const [value, setValue] = useState("");

	const [formData, setFormData] = useState<SignInState>({
		email: "",
		auth: {
			useMagicLink: false,
			password: "",
		},
	});

	const handleAuthChange = (
		field: "password" | "useMagicLink",
		value: string | boolean,
	) => {
		setFormData((prev) => ({
			...prev,
			auth: {
				...prev.auth,
				[field]: value,
			},
		}));
	};

	async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsPending(true);
		const formData = new FormData(event.target as HTMLFormElement);
		const error = await signInEmailAction(formData);

		if (error.message) {
			toast.error(error.message);
			setIsPending(false);
		} else {
			toast.success("Udalo sie!");
			router.push(PROFILE_ROUTE);
		}
	}

	return (
		<div className="flex flex-col gap-8">
			<header className="flex flex-col gap-2 items-center">
				<Header as={"h2"}>{t("title")}</Header>
			</header>
			<main className="flex flex-col gap-4">
				<div className="oauth-btns flex flex-col gap-2">
					<SignInOAuthBtn provider="google"></SignInOAuthBtn>
					<SignInOAuthBtn provider="facebook"></SignInOAuthBtn>
				</div>
				<div className="flex gap-3 items-center text-muted-foreground text-sm">
					<div className="h-[1px] w-full bg-muted"></div>
					<span>{t("divider")}</span>
					<div className="h-[1px] w-full bg-muted"></div>
				</div>

				<form
					action=""
					onSubmit={submitHandler}
					className="flex flex-col gap-4"
				>
					<div className="magic-link flex items-center gap-2">
						{useMagicLink}
						<Switch
							id="magic-link"
							checked={useMagicLink}
							onCheckedChange={() => {
								setUseMagicLink(!useMagicLink);
								handleAuthChange(
									"useMagicLink",
									!formData.auth.useMagicLink,
								);
							}}
						/>
						<label
							htmlFor="magic-link"
							className="flex items-center gap-2 cursor-pointer text-sm"
						>
							Zaloguj się za pomocą “Magic link”
						</label>
					</div>
					<pre className="w-full">
						{JSON.stringify(formData, null, 2)}
					</pre>
					<FieldGroup>
						<InputGroup>
							<InputGroupInput
								placeholder={t("placeholders.mail")}
								type="email"
								name="email"
								value={formData.email}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										email: e.target.value,
									}))
								}
							/>
							<InputGroupAddon>
								<IconMail />
							</InputGroupAddon>
						</InputGroup>
						{!useMagicLink && (
							<div className="password flex flex-col gap-1">
								<InputGroup>
									<InputGroupInput
										placeholder={t("placeholders.password")}
										type={
											showPassword ? "text" : "password"
										}
										name="password"
										value={formData.auth.password}
										onChange={(e) =>
											handleAuthChange(
												"password",
												e.target.value,
											)
										}
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
								<FieldDescription className="ml-3">
									<Link
										href={FORGOT_PASSWORD_ROUTE}
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
			<footer>{/* <LocaleSwitcher /> */}</footer>
		</div>
	);
}
