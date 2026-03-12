"use client";

import { useState } from "react";
import { Button } from "@/components/shadcn/ui/button";
import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import { Separator } from "@/components/shadcn/ui/separator";
import { IconArrowLeft, IconCheck, IconCopy } from "@tabler/icons-react";
import { SelectedTicket, OrderForm } from "../tickets-drawer";
import { createOrder } from "@/actions/orders/create-order.action";
import { useRouter } from "@/i18n/routing";
import { signUpEmailAction } from "@/actions/auth/sign-up-email.action";
import { ErrorCode } from "@/types/error-code";
import { signInEmailAction } from "@/actions/auth/sign-in-email.action";

type StepConfirmationProps = {
	items: SelectedTicket[];
	orderForm: OrderForm;
	eventId: string;
	orderId: string | null;
	eventSlug: string;
	reservationId: string;
	isLoggedIn: boolean;
	buyerEmail: string;
	onBack: () => void;
	onSuccess: (orderId: string) => void;
};

export const StepConfirmation = ({
	items,
	orderForm,
	eventId,
	orderId,
	eventSlug,
	isLoggedIn,
	buyerEmail,
	reservationId,
	onBack,
	onSuccess,
}: StepConfirmationProps) => {
	const [loading, setLoading] = useState(false);
	const [copied, setCopied] = useState(false);

	// Состояние регистрации после заказа
	const [password, setPassword] = useState("");
	const [registerLoading, setRegisterLoading] = useState(false);
	const [registered, setRegistered] = useState(false);
	const [registerError, setRegisterError] = useState<string | null>(null);
	const [mode, setMode] = useState<"register" | "login">("register");
	const [loginLoading, setLoginLoading] = useState(false);

	const router = useRouter();

	const total = items.reduce(
		(sum, item) => sum + item.ticket.price * item.quantity,
		0,
	);

	const handleConfirm = async () => {
		setLoading(true);
		try {
			const order = await createOrder({
				eventId,
				reservationId,
				email: orderForm.buyer.email,
				buyerName: orderForm.buyer.name,
				buyerSurname: orderForm.buyer.surname,
				buyerPhone: orderForm.buyer.phone,
				items: items.map((item) => ({
					ticketId: item.ticket.id,
					quantity: item.quantity,
				})),
				participants: orderForm.participants,
			});
			onSuccess(order.id);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	const copyOrderId = async () => {
		if (!orderId) return;
		await navigator.clipboard.writeText(orderId);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleLogin = async () => {
		setLoginLoading(true);
		setRegisterError(null);
		try {
			const formData = new FormData();
			formData.append("email", buyerEmail);
			formData.append("password", password);

			const result = await signInEmailAction(formData);

			if (!result.success) {
				setRegisterError("Nieprawidłowe hasło. Spróbuj ponownie.");
				return;
			}

			setRegistered(true);
		} catch (e: any) {
			if (e?.code === ErrorCode.INVALID_PASSWORD) {
				setRegisterError("Nieprawidłowe hasło. Spróbuj ponownie.");
			} else if (e?.code === ErrorCode.USER_NOT_FOUND) {
				setRegisterError("Nie znaleziono konta z tym adresem e-mail.");
			} else {
				setRegisterError("Nie udało się zalogować. Spróbuj ponownie.");
			}
		} finally {
			setLoginLoading(false);
		}
	};

	const handleRegister = async () => {
		setRegisterLoading(true);
		setRegisterError(null);
		try {
			const result = await signUpEmailAction({
				name: orderForm.buyer.name,
				surname: orderForm.buyer.surname,
				email: buyerEmail,
				password,
			});

			if (!result.success) {
				if (
					result.code ===
					ErrorCode.USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL
				) {
					setRegisterError(
						"Ten adres e-mail jest już zarejestrowany. Zaloguj się aby śledzić zamówienia.",
					);
				} else {
					setRegisterError(
						"Nie udało się założyć konta. Spróbuj ponownie.",
					);
				}
				return;
			}

			setRegistered(true);
		} catch {
			setRegisterError("Nie udało się założyć konta. Spróbuj ponownie.");
		} finally {
			setRegisterLoading(false);
		}
	};

	// ── Экран успешного заказа ──
	if (orderId) {
		return (
			<div className="flex flex-col items-center gap-6 py-8 text-center">
				{/* Иконка успеха */}
				<div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
					<IconCheck className="size-8 text-primary" />
				</div>

				{/* Заголовок */}
				<div className="flex flex-col gap-1">
					<p className="text-xl font-bold">Zamówienie złożone!</p>
					<p className="text-muted-foreground text-sm">
						Potwierdzenie zostanie wysłane na{" "}
						<span className="font-medium text-foreground">
							{orderForm.buyer.email}
						</span>
					</p>
				</div>

				{/* Номер заказа */}
				<div className="bg-muted rounded-xl p-4 w-full flex flex-col gap-2">
					<p className="text-sm text-muted-foreground">
						Numer zamówienia
					</p>
					<div className="flex items-center justify-between gap-2">
						<p className="font-mono font-bold text-sm break-all">
							{orderId}
						</p>
						<Button
							size="icon"
							variant="outline"
							onClick={copyOrderId}
						>
							{copied ? (
								<IconCheck className="size-4 text-primary" />
							) : (
								<IconCopy className="size-4" />
							)}
						</Button>
					</div>
				</div>

				{/* Инструкция по оплате — только для платных */}
				{total > 0 && (
					<div className="bg-muted rounded-xl p-4 w-full text-sm text-muted-foreground text-left flex flex-col gap-1">
						<p className="font-medium text-foreground">
							Jak zapłacić?
						</p>
						<p>Podaj numer zamówienia przy przelewie.</p>
						<p>Organizator potwierdzi płatność i wyśle bilety.</p>
					</div>
				)}

				{/* Блок регистрации — только для незалогиненных */}
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

								{registerError && (
									<div className="flex flex-col gap-2">
										<p className="text-sm text-destructive">
											{registerError}
										</p>
										{/* Предлагаем войти если email уже занят */}
										<button
											onClick={() => {
												setRegisterError(null);
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

								{registerError && (
									<p className="text-sm text-destructive">
										{registerError}
									</p>
								)}

								<Button
									onClick={handleLogin}
									disabled={
										password.length < 1 || loginLoading
									}
								>
									{loginLoading
										? "Logowanie..."
										: "Zaloguj się"}
								</Button>

								<button
									onClick={() => {
										setRegisterError(null);
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

				{/* Успешная регистрация */}
				{!isLoggedIn && registered && (
					<div className="w-full bg-primary/10 rounded-xl p-4 text-sm text-primary flex items-center gap-2">
						<IconCheck className="size-4 shrink-0" />
						Konto założone! Możesz teraz śledzić swoje zamówienia.
					</div>
				)}

				<Button
					variant="outline"
					className="w-full"
					onClick={() => router.push(`/events/${eventSlug}`)}
				>
					Wróć do wydarzenia
				</Button>
			</div>
		);
	}

	// ── Предпросмотр заказа ──
	return (
		<div className="flex flex-col gap-4">
			{/* Покупатель */}
			<div className="flex flex-col gap-1">
				<p className="font-semibold">Zamawiający</p>
				<p className="text-sm">
					{orderForm.buyer.name} {orderForm.buyer.surname}
				</p>
				<p className="text-sm text-muted-foreground">
					{orderForm.buyer.email}
				</p>
				{orderForm.buyer.phone && (
					<p className="text-sm text-muted-foreground">
						{orderForm.buyer.phone}
					</p>
				)}
			</div>

			<Separator />

			{/* Билеты */}
			<div className="flex flex-col gap-2">
				<p className="font-semibold">Bilety</p>
				{items.map((item) => (
					<div
						key={item.ticket.id}
						className="flex justify-between text-sm"
					>
						<span>
							{item.ticket.name} × {item.quantity}
						</span>
						<span className="font-medium">
							{item.ticket.price === 0
								? "Bezpłatny"
								: `${((item.ticket.price * item.quantity) / 100).toFixed(2)} zł`}
						</span>
					</div>
				))}
			</div>

			<Separator />

			{/* Итог */}
			<div className="flex justify-between font-bold">
				<span>Razem</span>
				<span>
					{total === 0
						? "Bezpłatne"
						: `${(total / 100).toFixed(2)} zł`}
				</span>
			</div>

			<div className="flex gap-3">
				<Button variant="outline" onClick={onBack} className="flex-1">
					<IconArrowLeft className="size-4" />
					Wróć
				</Button>
				<Button
					onClick={handleConfirm}
					disabled={loading}
					className="flex-1"
				>
					{loading ? "Składanie..." : "Potwierdź zamówienie"}
				</Button>
			</div>
		</div>
	);
};
