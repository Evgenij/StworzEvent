"use client";
import { useTranslations } from "next-intl";
import { Header } from "../header/header";
import LocaleSwitcher from "../locale-switcher";

export default function RegistrationForm() {
	const t = useTranslations("Registration");
	const submitHandler = () => {
		console.log("submited");
	};

	return (
		<form action="" onSubmit={submitHandler}>
			<header className="flex flex-col gap-2 items-center">
				<Header as={"h2"}>{t("title")}</Header>
				<p className="text-muted-foreground text-center text-sm">
					Wpisz poniżej swój adres e-mail, <br /> aby utworzyć konto.
				</p>
			</header>
			<main></main>
			<footer>
				<LocaleSwitcher />
			</footer>
		</form>
	);
}
