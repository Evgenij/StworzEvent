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
import { signUp } from "@/lib/auth-client";
import { Link, useRouter } from "@/i18n/routing";
import { PROFILE_ROUTE, SIGNIN_ROUTE } from "@/helpers/routes";
import { Spinner } from "@/components/ui/spinner";

export default function SignUpForm() {
	const t = useTranslations("SignUpForm");
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();
	const [isPending, setIsPending] = useState(false);

	async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		console.log(event.target);
		const formData = new FormData(event.target as HTMLFormElement);
		//TODO Add validation
		const email = String(formData.get("email"));
		const password = String(formData.get("password"));
		const name = "test";

		await signUp.email(
			{
				name,
				email,
				password,
			},
			{
				onRequest: () => {
					setIsPending(true);
				},
				onResponse: () => {
					setIsPending(false);
				},
				onError: (ctx) => {
					console.log(ctx.error.message);
				},
				onSuccess: () => {
					router.push(PROFILE_ROUTE);
				},
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

					<Button
						type="submit"
						size={"lg"}
						className="w-full"
						disabled={isPending}
					>
						{isPending && <Spinner />}
						{t("button")}
					</Button>
					<p className="text-muted-foreground text-sm text-center mt-2">
						Already have an account?{" "}
						<Link href={SIGNIN_ROUTE} className="link-default">
							Sing In{" "}
						</Link>
					</p>
				</form>
			</main>
			<footer>{/* <LocaleSwitcher /> */}</footer>
		</div>
	);
}
