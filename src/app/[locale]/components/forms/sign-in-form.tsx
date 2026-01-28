"use client";
import { useTranslations } from "next-intl";
import { Header } from "../header/header";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
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
} from "@tabler/icons-react";
import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "@/i18n/routing";
import {PROFILE_ROUTE}  from "@/helpers/routes";

export default function SignInForm() {
	const t = useTranslations("SignInForm");
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);

	async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		console.log(event.target);
		const formData = new FormData(event.target as HTMLFormElement);
		//TODO Add validation
		const email = String(formData.get("email"));
		const password = String(formData.get("password"));

		await signIn.email(
			{
				email,
				password,
			},
			{
				onRequest: () => {},
				onResponse: () => {},
				onError: (ctx) => {
					console.log(ctx.error.message);
				},
				onSuccess: () => {
					// TODO change to PROFILE
					router.push(PROFILE_ROUTE);
				},
			},
		);
	}

	return (
		<div className="flex flex-col gap-10">
			<header className="flex flex-col gap-2 items-center">
				<Header as={"h2"}>{t("title")}</Header>
				{/*<p className="text-muted-foreground text-center text-sm">*/}
				{/*	/!* {t("subtitle")} *!/*/}
				{/*	{t.rich("subtitle", {*/}
				{/*		lineBreak: () => <br />,*/}
				{/*		// Можно даже стилизовать части текста:*/}
				{/*		important: (chunks) => (*/}
				{/*			<span className="text-primary font-bold">*/}
				{/*				{chunks}*/}
				{/*			</span>*/}
				{/*		),*/}
				{/*	})}*/}
				{/*	/!* Wpisz poniżej swój adres e-mail, <br /> aby utworzyć konto. *!/*/}
				{/*</p>*/}
			</header>
			<main>
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
						<InputGroup>
							<InputGroupInput
								placeholder="wpisz haslo"
								type={showPassword ? "text" : "password"}
								name="password"
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
					</FieldGroup>

					<Button type="submit" size={"lg"} className="w-full">
						{t("button")}
					</Button>
				</form>
			</main>
			<footer>{/* <LocaleSwitcher /> */}</footer>
		</div>
	);
}
