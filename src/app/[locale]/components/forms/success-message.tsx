import React from "react";
import { Header } from "../header/header";
import { Button } from "@/shadcn/ui/button";
import { Link } from "@/i18n/routing";

type Props = {
	header: string;
	subheader: string;
	textBtn: string;
	addLink?: string;
	action: () => void;
};

const SuccessMessage = ({
	header,
	subheader,
	textBtn,
	addLink,
	action,
}: Props) => {
	return (
		<div className="flex flex-col gap-9">
			<header className="flex flex-col gap-3 items-center">
				<Header as={"h2"} className="text-center">
					{header}
				</Header>
				<p className="text-muted-foreground text-center text-sm">
					{subheader}
				</p>
			</header>
			<main className="flex flex-col gap-4">
				<Button size={"lg"} className="w-full" onClick={action}>
					{textBtn}
				</Button>

				{addLink && (
					<p className="text-muted-foreground text-sm text-center">
						add
						<Link href={addLink} className="link-default">
							text
						</Link>
					</p>
				)}

				{/* <form
					id="sign-up-form"
					className="flex flex-col gap-4"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<FieldGroup>
						<div className="flex gap-2">
							<Controller
								name="user.name"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<InputGroup>
											<InputGroupAddon>
												<IconUser />
											</InputGroupAddon>
											<InputGroupInput
												{...field}
												id="name"
												name="name"
												aria-invalid={
													fieldState.invalid
												}
												placeholder={tAuth(
													"placeholders.name",
												)}
												autoComplete="on"
												type="text"
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
							<Controller
								name="user.surname"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<InputGroup>
											<InputGroupInput
												{...field}
												id="surname"
												name="surname"
												aria-invalid={
													fieldState.invalid
												}
												placeholder={tAuth(
													"placeholders.surname",
												)}
												autoComplete="on"
												type="text"
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
						</div>

						{/* <InputGroup>
							<InputGroupInput
								placeholder="name"
								type="name"
								name="name"
							/>
							<InputGroupAddon>
								<IconUser />
							</InputGroupAddon>
						</InputGroup> */}

				{/* <Controller
							name="email"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<InputGroup>
										<InputGroupInput
											{...field}
											aria-invalid={fieldState.invalid}
											placeholder={tAuth(
												"placeholders.mail",
											)}
											type="email"
											name={field.name}
											autoComplete="on"
										/>
										<InputGroupAddon>
											<IconMail />
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
							name="password"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<InputGroup>
										<InputGroupInput
											{...field}
											aria-invalid={fieldState.invalid}
											placeholder={tAuth(
												"placeholders.password",
											)}
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
					</FieldGroup>

					
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
				</form> */}
			</main>
		</div>
	);
};

export default SuccessMessage;
