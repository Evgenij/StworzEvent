"use client";

import { Header } from "../header/header";

export default function RegistrationForm() {
	const submitHandler = () => {
		console.log("submited");
	};

	return (
		<form action="" onSubmit={submitHandler}>
			<header className="flex flex-col gap-2 items-center">
				<Header as={"h2"}>Załóż konto</Header>
				<p className="text-muted-foreground text-center text-sm">
					Wpisz poniżej swój adres e-mail, <br /> aby utworzyć konto.
				</p>
			</header>
			<main></main>
			<footer></footer>
		</form>
	);
}
