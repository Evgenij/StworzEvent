// steps/confirmation/step-order-success.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/shadcn/ui/button";
import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useRouter } from "@/i18n/routing";
import { signUpEmailAction } from "@/actions/auth/sign-up-email.action";
import { signInEmailAction } from "@/actions/auth/sign-in-email.action";
import { ErrorCode } from "@/types/error-code";

type StepOrderSuccessProps = {
	orderId: string;
	orderTotal: number;
	eventSlug: string;
	isLoggedIn: boolean;
	buyerData: {
		email: string;
		name: string;
		surname: string;
	} | null;
};

export const StepOrderSuccess = ({
	orderId,
	orderTotal,
	eventSlug,
	isLoggedIn,
	buyerData,
}: StepOrderSuccessProps) => {
	const router = useRouter();
	const buyerEmail = buyerData?.email ?? "";
	const buyerName = buyerData?.name ?? "";
	const buyerSurname = buyerData?.surname ?? "";

	const [copied, setCopied] = useState(false);
	const [password, setPassword] = useState("");
	const [registerLoading, setRegisterLoading] = useState(false);
	const [loginLoading, setLoginLoading] = useState(false);
	const [registered, setRegistered] = useState(false);
	const [authError, setAuthError] = useState<string | null>(null);
	const [mode, setMode] = useState<"register" | "login">("register");

	const copyOrderId = async () => {
		await navigator.clipboard.writeText(orderId);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleRegister = async () => {
		setRegisterLoading(true);
		setAuthError(null);
		try {
			const result = await signUpEmailAction({
				name: buyerName,
				surname: buyerSurname,
				email: buyerEmail,
				password,
			});
			if (!result.success) {
				if (
					result.code ===
					ErrorCode.USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL
				) {
					setAuthError("Ten adres e-mail jest już zarejestrowany.");
				} else {
					setAuthError(
						"Nie udało się założyć konta. Spróbuj ponownie.",
					);
				}
				return;
			}
			setRegistered(true);
		} catch {
			setAuthError("Nie udało się założyć konta. Spróbuj ponownie.");
		} finally {
			setRegisterLoading(false);
		}
	};

	const handleLogin = async () => {
		setLoginLoading(true);
		setAuthError(null);
		try {
			const formData = new FormData();
			formData.append("email", buyerEmail);
			formData.append("password", password);
			const result = await signInEmailAction(formData);
			if (!result.success) {
				setAuthError("Nieprawidłowe hasło. Spróbuj ponownie.");
				return;
			}
			setRegistered(true);
		} catch {
			setAuthError("Nie udało się zalogować. Spróbuj ponownie.");
		} finally {
			setLoginLoading(false);
		}
	};

	return (
		<div className="flex flex-col max-w-lg mx-auto items-center gap-6 py-8 text-center">
			<div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
				<IconCheck className="size-8 text-primary" />
			</div>

			<div className="flex flex-col gap-1">
				<p className="text-xl font-bold">Zamówienie złożone!</p>
				<p className="text-muted-foreground text-sm">
					Potwierdzenie zostanie wysłane na{" "}
					<span className="font-medium text-foreground">
						{buyerEmail}
					</span>
				</p>
			</div>

			<div className="bg-muted rounded-xl p-4 w-full flex flex-col gap-2">
				<p className="text-sm text-muted-foreground">
					Numer zamówienia
				</p>
				<div className="flex items-center justify-between gap-2">
					<p className="font-mono font-bold text-sm break-all">
						{orderId}
					</p>
					<Button size="icon" variant="outline" onClick={copyOrderId}>
						{copied ? (
							<IconCheck className="size-4 text-primary" />
						) : (
							<IconCopy className="size-4" />
						)}
					</Button>
				</div>
			</div>

			{orderTotal > 0 && (
				<div className="bg-muted rounded-xl p-4 w-full text-sm text-muted-foreground text-left flex flex-col gap-1">
					<p className="font-medium text-foreground">Jak zapłacić?</p>
					<p>Podaj numer zamówienia przy przelewie.</p>
					<p>Organizator potwierdzi płatność i wyśle bilety.</p>
				</div>
			)}

			{!isLoggedIn && !registered && (
				<div className="w-full border rounded-xl p-5 flex flex-col gap-3 text-left">
					{mode === "register" ? (
						<>
							<div className="flex flex-col gap-1">
								<p className="font-semibold">
									Śledź swoje zamówienia
								</p>
								<p className="text-sm text-muted-foreground">
									Załóż konto używając adresu{" "}
									<span className="font-medium text-foreground">
										{buyerEmail}
									</span>
								</p>
							</div>
							<div className="flex flex-col gap-1">
								<Label>Ustaw hasło</Label>
								<Input
									type="password"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									placeholder="Minimum 8 znaków"
								/>
							</div>
							{authError && (
								<div className="flex flex-col gap-2">
									<p className="text-sm text-destructive">
										{authError}
									</p>
									<button
										onClick={() => {
											setAuthError(null);
											setPassword("");
											setMode("login");
										}}
										className="text-sm text-primary underline text-left"
									>
										Zaloguj się na istniejące konto
									</button>
								</div>
							)}
							<Button
								onClick={handleRegister}
								disabled={
									password.length < 8 || registerLoading
								}
							>
								{registerLoading
									? "Zakładanie konta..."
									: "Załóż konto"}
							</Button>
						</>
					) : (
						<>
							<div className="flex flex-col gap-1">
								<p className="font-semibold">Zaloguj się</p>
								<p className="text-sm text-muted-foreground">
									Wpisz hasło dla{" "}
									<span className="font-medium text-foreground">
										{buyerEmail}
									</span>
								</p>
							</div>
							<div className="flex flex-col gap-1">
								<Label>Hasło</Label>
								<Input
									type="password"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									placeholder="Twoje hasło"
								/>
							</div>
							{authError && (
								<p className="text-sm text-destructive">
									{authError}
								</p>
							)}
							<Button
								onClick={handleLogin}
								disabled={password.length < 1 || loginLoading}
							>
								{loginLoading ? "Logowanie..." : "Zaloguj się"}
							</Button>
							<button
								onClick={() => {
									setAuthError(null);
									setPassword("");
									setMode("register");
								}}
								className="text-sm text-muted-foreground underline text-left"
							>
								Wróć do zakładania konta
							</button>
						</>
					)}
				</div>
			)}

			{!isLoggedIn && registered && (
				<div className="w-full bg-primary/10 rounded-xl p-4 text-sm text-primary flex items-center gap-2">
					<IconCheck className="size-4 shrink-0" />
					Konto założone! Możesz teraz śledzić swoje zamówienia.
				</div>
			)}

			<Button
				variant="outline"
				className="w-full"
				onClick={() => {
					sessionStorage.removeItem(`order_success_${eventSlug}`);
					router.push(`/events/${eventSlug}`);
				}}
			>
				Wróć do wydarzenia
			</Button>
		</div>
	);
};
