"use client";
import { useTranslations } from "next-intl";
import { Header } from "../header/header";
import LocaleSwitcher from "../locale-switcher";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
	IconSearch,
} from "@tabler/icons-react";
import { useState } from "react";
import { signUp } from "@/lib/auth-client";

export default function RegistrationForm() {
	const t = useTranslations("Registration");
	const [showPassword, setShowPassword] = useState(false);

	async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		console.log(event.target);
		const formData = new FormData(event.target as HTMLFormElement);
		//TODO Add validation
		const email = "email@gmail.com";
		const password = "pass34634533";
		const name = "test";

		await signUp.email(
			{
				name,
				email,
				password,
			},
			{
				onRequest: () => {},
				onResponse: () => {},
				onError: (ctx) => {
					console.log(ctx.error.message);
				},
				onSuccess: () => {},
			},
		);
	}

	return (
		<div className="flex flex-col gap-10">
			<header className="flex flex-col gap-2 items-center">
				<Header as={"h2"}>{t("title")}</Header>
				<p className="text-muted-foreground text-center text-sm">
					{/* {t("subtitle")} */}
					{t.rich("subtitle", {
						lineBreak: () => <br />,
						// Можно даже стилизовать части текста:
						important: (chunks) => (
							<span className="text-primary font-bold">
								{chunks}
							</span>
						),
					})}
					{/* Wpisz poniżej swój adres e-mail, <br /> aby utworzyć konto. */}
				</p>
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

					<Button type="submit" size={"default"} className="w-full">
						{t("button")}
					</Button>
				</form>
			</main>
			<footer>{/* <LocaleSwitcher /> */}</footer>
		</div>
	);
}
