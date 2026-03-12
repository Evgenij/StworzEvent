"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/shadcn/ui/button";
import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import { Checkbox } from "@/components/shadcn/ui/checkbox";
import { Separator } from "@/components/shadcn/ui/separator";
import { IconArrowLeft, IconTicket, IconTicketOff } from "@tabler/icons-react";
import { SelectedTicket, OrderForm, ParticipantForm } from "../tickets-drawer";
import { Ticket } from "@prisma/client";
import { useCountdown } from "@/hooks/use-countdown";
import { TicketWrapper } from "@/components/shared/ticket-wrapper";
import { useRouter } from "next/navigation";

type StepParticipantsProps = {
	items: SelectedTicket[]; // выбранные билеты из шага 1 (только те где quantity > 0)
	expiresAt: Date; // дата истечения времени заказа
	onBack: () => void; // вернуться на шаг 1
	onNext: (form: OrderForm) => void; // перейти на шаг 3 с заполненными данными
};

// Пустой шаблон участника — используем чтобы создать начальное состояние форм
const emptyParticipant = (): ParticipantForm => ({
	name: "",
	surname: "",
	email: "",
	phone: "",
});

// ─────────────────────────────────────────────
// FlatParticipant — вспомогательный тип
// ─────────────────────────────────────────────
// items из шага 1 выглядят так:
//   [{ ticket: VIP, quantity: 2 }, { ticket: Reg, quantity: 1 }]
//
// Но нам нужно рендерить форму для КАЖДОГО участника отдельно.
// Поэтому разворачиваем в плоский список:
//   [
//     { ticket: VIP, groupIdx: 0, participantIdx: 0, globalIdx: 1, idxInTicket: 1 },
//     { ticket: VIP, groupIdx: 0, participantIdx: 1, globalIdx: 2, idxInTicket: 2 },
//     { ticket: Reg, groupIdx: 1, participantIdx: 0, globalIdx: 3, idxInTicket: 1 },
//   ]
//
// groupIdx      — индекс типа билета в массиве items (VIP = 0, Reg = 1)
// participantIdx — номер участника внутри типа (0, 1, 2...)
// globalIdx     — сквозной номер для отображения (#1, #2, #3...)
// idxInTicket   — номер участника внутри типа билета (1, 2...)
type FlatParticipant = {
	ticket: Ticket;
	idxInTicket: number;
	globalIdx: number;
	groupIdx: number;
	participantIdx: number;
};

// Строим плоский список из items
const buildFlatList = (items: SelectedTicket[]): FlatParticipant[] => {
	const flat: FlatParticipant[] = [];
	let globalIdx = 1;
	items.forEach((item, groupIdx) => {
		for (let pi = 0; pi < item.quantity; pi++) {
			flat.push({
				ticket: item.ticket,
				idxInTicket: pi + 1,
				globalIdx: globalIdx++,
				groupIdx,
				participantIdx: pi,
			});
		}
	});
	return flat;
};

export const StepParticipants = ({
	items,
	expiresAt,
	onBack,
	onNext,
}: StepParticipantsProps) => {
	const { formatted, isExpired } = useCountdown(expiresAt);
	const router = useRouter();

	// Если резервация истекла — редиректим назад
	useEffect(() => {
		if (isExpired) {
			router.back();
		}
	}, [isExpired]);

	// Данные покупателя (заказывающего) — отдельно от участников
	const [buyer, setBuyer] = useState<ParticipantForm>(emptyParticipant());

	// Флаг: покупатель тоже является участником
	// Если true — он занимает один слот в списке участников
	// и его данные не нужно вводить повторно
	const [buyerIsParticipant, setBuyerIsParticipant] = useState(true);

	// Индекс группы (типа билета) который занимает покупатель
	// Например: покупатель выбрал VIP → buyerTicketGroupIdx = 0
	// Это нужно чтобы знать какой СЛОТ пропустить при рендере форм участников
	const [buyerTicketGroupIdx, setBuyerTicketGroupIdx] = useState(0);

	// Двумерная структура данных участников:
	// participants[groupIdx].items[participantIdx] = ParticipantForm
	//
	// Пример для VIP×2 + Reg×1:
	// [
	//   { ticketId: "vip", items: [emptyParticipant(), emptyParticipant()] },
	//   { ticketId: "reg", items: [emptyParticipant()] },
	// ]
	const [participants, setParticipants] = useState<OrderForm["participants"]>(
		items.map((item) => ({
			ticketId: item.ticket.id,
			ticketName: item.ticket.name,
			items: Array.from({ length: item.quantity }, emptyParticipant),
		})),
	);

	// Плоский список — строим один раз, используем для рендера карточек
	const flatList = buildFlatList(items);

	// Обновляем конкретное поле конкретного участника
	// groupIdx — тип билета, participantIdx — номер участника в группе
	const updateParticipant = (
		groupIdx: number,
		participantIdx: number,
		field: keyof ParticipantForm,
		value: string,
	) => {
		setParticipants((prev) =>
			prev.map((group, gi) =>
				gi === groupIdx
					? {
							...group,
							items: group.items.map((p, pi) =>
								pi === participantIdx
									? { ...p, [field]: value }
									: p,
							),
						}
					: group,
			),
		);
	};

	// Копируем email покупателя в поле участника
	// Вызывается при чекбоксе "Użyj adresu e-mail zamawiającego"
	const copyBuyerEmail = (groupIdx: number, participantIdx: number) => {
		updateParticipant(groupIdx, participantIdx, "email", buyer.email);
	};

	// При нажатии "Dalej":
	// Если покупатель = участник — подставляем его данные в нужный слот
	// перед передачей на следующий шаг
	const handleNext = () => {
		const finalParticipants = participants.map((group, gi) => ({
			...group,
			items: group.items.map((p, pi) => {
				// Слот покупателя — заменяем данными покупателя
				if (
					buyerIsParticipant &&
					gi === buyerTicketGroupIdx &&
					pi === 0
				) {
					return { ...buyer };
				}
				return p;
			}),
		}));

		onNext({ buyer, buyerIsParticipant, participants: finalParticipants });
	};

	// Валидация формы перед переходом на шаг 3:
	// 1. Покупатель — имя, фамилия, email обязательны
	// 2. Каждый участник — имя, фамилия, email обязательны
	//    Исключение: слот покупателя пропускаем (его данные уже есть)
	const isValid = () => {
		if (!buyer.name || !buyer.surname || !buyer.email) return false;
		return participants.every((group, gi) =>
			group.items.every((p, pi) => {
				if (
					buyerIsParticipant &&
					gi === buyerTicketGroupIdx &&
					pi === 0
				)
					return true; // слот покупателя — пропускаем
				return p.name && p.surname && p.email;
			}),
		);
	};

	// Итоговая сумма для резюме в левой колонке
	const total = items.reduce(
		(sum, item) => sum + item.ticket.price * item.quantity,
		0,
	);

	return (
		<div className="grid grid-cols-[380px_1fr] gap-6 items-start">
			{/* ── ЛЕВАЯ КОЛОНКА: покупатель + резюме заказа ── */}

			<div className="self-start sticky top-18 flex flex-col gap-4 border rounded-xl p-5">
				<p className="font-bold text-lg">Zamawiający</p>

				<div className="grid grid-cols-2 gap-3 ">
					<div className="flex flex-col gap-1">
						<Label>Imię *</Label>
						<Input
							value={buyer.name}
							onChange={(e) =>
								setBuyer({ ...buyer, name: e.target.value })
							}
							placeholder="Jan"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<Label>Nazwisko *</Label>
						<Input
							value={buyer.surname}
							onChange={(e) =>
								setBuyer({
									...buyer,
									surname: e.target.value,
								})
							}
							placeholder="Kowalski"
						/>
					</div>
				</div>

				<div className="flex flex-col gap-1">
					<Label>Email *</Label>
					<Input
						type="email"
						value={buyer.email}
						onChange={(e) =>
							setBuyer({ ...buyer, email: e.target.value })
						}
						placeholder="poczta@example.com"
					/>
				</div>

				<div className="flex items-center gap-2">
					<Checkbox
						id="buyerIsParticipant"
						checked={buyerIsParticipant}
						onCheckedChange={(v) => setBuyerIsParticipant(!!v)}
					/>
					<Label
						htmlFor="buyerIsParticipant"
						className="cursor-pointer"
					>
						Jestem uczestnikiem (bilet 1)
					</Label>
				</div>

				{/* Выбор типа билета для покупателя
            Показываем только если покупатель = участник
            Если один тип билета — кнопка одна, выбор очевиден */}
				{buyerIsParticipant && (
					<div className="flex flex-col gap-2">
						<Label>Rodzaj biletu</Label>
						<div className="flex flex-wrap gap-2">
							{items.map((item, gi) => (
								<button
									key={item.ticket.id}
									onClick={() => setBuyerTicketGroupIdx(gi)}
									className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
										buyerTicketGroupIdx === gi
											? "bg-primary text-primary-foreground border-primary"
											: "bg-background border-border hover:border-primary"
									}`}
								>
									{item.ticket.name}
								</button>
							))}
						</div>
					</div>
				)}

				<Separator />

				{/* Резюме заказа — показываем что купили и итог */}
				<div className="flex flex-col gap-2">
					<p className="font-semibold text-sm">Twoje zamówienie</p>
					{items.map((item) => (
						<div
							key={item.ticket.id}
							className="flex justify-between text-sm text-muted-foreground"
						>
							<span>
								{item.ticket.name} × {item.quantity}
							</span>
							<span className="font-medium text-foreground">
								{item.ticket.price === 0
									? "Bezpłatny"
									: `${((item.ticket.price * item.quantity) / 100).toFixed(2)} zł`}
							</span>
						</div>
					))}
					<Separator />
					<div className="flex justify-between font-bold text-sm">
						<span>Razem</span>
						<span>
							{total === 0
								? "Bezpłatne"
								: `${(total / 100).toFixed(2)} zł`}
						</span>
					</div>
				</div>

				<div
					className={`bg-muted rounded-lg px-3 py-2 text-sm flex items-center gap-2 ${isExpired ? "bg-destructive/10 text-destructive" : "text-muted-foreground"}`}
				>
					<span>⏱</span>
					<span>
						Rezerwacja wygasa za{" "}
						<span
							className={`font-bold ${isExpired ? "text-destructive" : "text-foreground"}`}
						>
							{formatted}
						</span>
					</span>
				</div>
			</div>

			{/* ── ПРАВАЯ КОЛОНКА: формы участников ── */}
			<div className="flex flex-col gap-4">
				<p className="font-bold text-lg">Dane uczestników</p>

				{/* Итерируем по плоскому списку участников
            Каждый элемент = одна карточка с формой */}
				{flatList.map((flat) => {
					// Определяем: этот слот занят покупателем?
					// Если да — пропускаем рендер карточки (покупатель уже заполнен слева)
					const isBuyerSlot =
						buyerIsParticipant &&
						flat.groupIdx === buyerTicketGroupIdx &&
						flat.participantIdx === 0;

					if (isBuyerSlot) return null;

					// Берём текущее состояние формы участника из двумерного массива
					const participant =
						participants[flat.groupIdx].items[flat.participantIdx];

					return (
						<TicketWrapper
							key={`${flat.groupIdx}-${flat.participantIdx}`}
						>
							<div className="flex flex-col gap-4">
								{/* Заголовок карточки: тип билета + номер участника */}
								<div className="flex items-center gap-2 text-sm font-semibold">
									<IconTicket className="size-5 text-primary" />
									<span>{flat.ticket.name}</span>
									<span className="text-muted-foreground font-normal">
										— uczestnik {flat.participantIdx + 1}/
										{items[flat.groupIdx].quantity}
									</span>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<div className="flex flex-col gap-1">
										<Label>Imię *</Label>
										<Input
											value={participant.name}
											onChange={(e) =>
												updateParticipant(
													flat.groupIdx,
													flat.participantIdx,
													"name",
													e.target.value,
												)
											}
											placeholder="Jan"
										/>
									</div>
									<div className="flex flex-col gap-1">
										<Label>Nazwisko *</Label>
										<Input
											value={participant.surname}
											onChange={(e) =>
												updateParticipant(
													flat.groupIdx,
													flat.participantIdx,
													"surname",
													e.target.value,
												)
											}
											placeholder="Kowalski"
										/>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<div className="flex flex-col gap-1">
										<Label>Email *</Label>
										<Input
											type="email"
											value={participant.email}
											onChange={(e) =>
												updateParticipant(
													flat.groupIdx,
													flat.participantIdx,
													"email",
													e.target.value,
												)
											}
											placeholder="jan@example.com"
										/>
									</div>
									<div className="flex flex-col gap-1">
										<Label>
											Telefon{" "}
											<span className="text-muted-foreground font-normal">
												(opcjonalnie)
											</span>
										</Label>
										<Input
											type="tel"
											value={participant.phone}
											onChange={(e) =>
												updateParticipant(
													flat.groupIdx,
													flat.participantIdx,
													"phone",
													e.target.value,
												)
											}
											placeholder="+48 758-534-234"
										/>
									</div>
								</div>

								{/* Показываем чекбокс только если покупатель уже ввёл email
                  Чекбокс копирует email покупателя в поле участника
                  При снятии — очищает поле */}
								{buyer.email && (
									<div className="flex items-center gap-2">
										<Checkbox
											id={`copy-email-${flat.groupIdx}-${flat.participantIdx}`}
											checked={
												participant.email ===
												buyer.email
											}
											onCheckedChange={(v) => {
												if (v) {
													copyBuyerEmail(
														flat.groupIdx,
														flat.participantIdx,
													);
												} else {
													updateParticipant(
														flat.groupIdx,
														flat.participantIdx,
														"email",
														"",
													);
												}
											}}
										/>
										<Label
											htmlFor={`copy-email-${flat.groupIdx}-${flat.participantIdx}`}
											className="cursor-pointer text-sm"
										>
											Użyj adresu e-mail zamawiającego
										</Label>
									</div>
								)}
							</div>
						</TicketWrapper>
					);
				})}

				<div className="flex gap-3 pt-2">
					<Button
						variant="outline"
						onClick={onBack}
						className="flex-1"
					>
						<IconArrowLeft className="size-4" />
						Wróć
					</Button>
					<Button
						onClick={handleNext}
						disabled={!isValid()}
						className="flex-1"
					>
						Dalej
					</Button>
				</div>
			</div>
		</div>
	);
};
