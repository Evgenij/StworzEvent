"use client";
import { useTranslations } from "next-intl";
import { Header } from "#/components/header/header";
import { Button } from "@/shadcn/ui/button";
import { FieldGroup } from "@/shadcn/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/shadcn/ui/input-group";
import {
	IconEye,
	IconEyeClosed,
	IconHeart,
	IconLock,
	IconMail,
	IconUser,
} from "@tabler/icons-react";
import { useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { SIGNIN_ROUTE } from "@/helpers/routes";
import { Spinner } from "@/shadcn/ui/spinner";
import { signUpEmailAction } from "@/actions/sign-up-email.action";
import { toast } from "sonner";
import SignInOAuthBtn from "#/components/sign-in-oauth-btn";

export default function SignUpForm() {
	const t = useTranslations("SignUpForm");
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();
	const [isPending, setIsPending] = useState(false);

	async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		setIsPending(true);

		const formData = new FormData(event.target as HTMLFormElement);
		const error = await signUpEmailAction(formData);

		if (error.message) {
			console.log(error);
			toast.error(error.message, {
				//icon: <IconEye />,
				description: error.description,
				// action: {
				// 	label: "Close",
				// 	onClick: () => console.log("Undo"),
				// },
				classNames: {
					description: "!text-foreground/70",
				},
			});

			// toast.error(error, {
			// 	position: "top-center",
			// 	description: "Sunday, December 03, 2023 at 9:00 AM",
			// 	icon: <IconEye className="h-4 w-4" />,
			// 	action: {
			// 		label: "Undo",
			// 		onClick: () => console.log("Undo"),
			// 	},
			// 	className:
			// 		"bg-blue-400 text-card-foreground border-border [&>[data-description]]:text-card-foreground/80",
			// 	// classNames: {
			// 	// 	description: "text-blue-500",
			// 	// },
			// });
			// toast("Event has been created", {
			// 	description: "Sunday, December 03, 2023 at 9:00 AM",
			// 	action: {
			// 		label: "Undo",
			// 		onClick: () => console.log("Undo"),
			// 	},
			// 	classNames: {
			// 		description: "!text-foreground/80",
			// 	},
			// });
			// toast.custom((t) => (
			// 	<div className="bg-gradient-to-r from-pink-500 to-violet-500 text-white p-4 rounded-lg shadow-lg">
			// 		<div className="flex items-center gap-2">
			// 			<IconHeart className="h-5 w-5" />
			// 			<div>
			// 				<div className="font-semibold">Custom Toast</div>
			// 				<div className="text-sm opacity-90">
			// 					Built with your own JSX
			// 				</div>
			// 			</div>
			// 			<button
			// 				type="button"
			// 				className="ml-auto bg-white/20 hover:bg-white/30 rounded px-2 py-1 text-xs"
			// 				onClick={() => toast.dismiss(t)}
			// 			>
			// 				Close
			// 			</button>
			// 		</div>
			// 	</div>
			// ));
			setIsPending(false);
		} else {
			toast.success("Rejestracja zakończona!", {
				description:
					"Na Twój adres e-mail wysłano SMS-a w celu potwierdzenia adresu.",
				classNames: {
					description: "!text-foreground/70",
				},
			});
			router.push(SIGNIN_ROUTE);
		}

		//TODO Add validation
		// const email = String(formData.get("email"));
		// const password = String(formData.get("password"));
		// const name = "test";

		// await signUp.email(
		// 	{
		// 		name,
		// 		email,
		// 		password,
		// 	},
		// 	{
		// 		onRequest: () => {
		// 			setIsPending(true);
		// 		},
		// 		onResponse: () => {
		// 			setIsPending(false);
		// 		},
		// 		onError: (ctx) => {
		// 			console.log(ctx.error.message);
		// 		},
		// 		onSuccess: () => {
		// 			router.push(PROFILE_ROUTE);
		// 		},
		// 	},
		// );
	}

	return (
		<div className="flex flex-col gap-10">
			<header className="flex flex-col gap-2 items-center">
				<Header as={"h2"}>{t("title")}</Header>
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
			<main>
				<form
					action=""
					onSubmit={submitHandler}
					className="flex flex-col gap-3"
				>
					<FieldGroup>
						<InputGroup>
							<InputGroupInput
								placeholder="name"
								type="name"
								name="name"
							/>
							<InputGroupAddon>
								<IconUser />
							</InputGroupAddon>
						</InputGroup>
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
					<hr className="my-4" />

					<SignInOAuthBtn signUp provider="facebook"></SignInOAuthBtn>
					<SignInOAuthBtn signUp provider="google"></SignInOAuthBtn>
				</form>
			</main>
			<footer>{/* <LocaleSwitcher /> */}</footer>
		</div>
	);
}
