"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shadcn/ui/button";
import { IconArrowLeft, IconUsers } from "@tabler/icons-react";
import { SelectedTicket, OrderForm } from "../../tickets-drawer";
import { useCountdown } from "@/hooks/use-countdown";
import { Typography } from "@/components/shared";
import { orderFormSchema, OrderFormValues } from "@/schemas/order.schema";
import { buildFlatList } from "@/helpers/build-flat-list";
import BuyerDetails from "./buyer-details";
import OrderDetails from "./order-details";
import ReservationTimer from "./reservation-timer";
import { ParticipantList } from "./participant-list";

type StepParticipantsProps = {
	items: SelectedTicket[];
	expiresAt: Date;
	onBack: () => void;
	onNext: (form: OrderForm) => void;
};

export const StepParticipants = ({
	items,
	expiresAt,
	onBack,
	onNext,
}: StepParticipantsProps) => {
	const router = useRouter();
	const tErrors = useTranslations("Errors");
	const { formatted, isExpired, remaining } = useCountdown(expiresAt);

	useEffect(() => {
		if (isExpired) router.back();
	}, [isExpired]);

	// ── Единая форма для всего шага ──
	const form = useForm<OrderFormValues>({
		resolver: zodResolver(orderFormSchema(tErrors)),
		defaultValues: {
			buyer: { name: "", surname: "", email: "", phone: "" },
			buyerIsParticipant: false,
			buyerTicketGroupIdx: 0,
			participants: items.map((item) => ({
				ticketId: item.ticket.id,
				ticketName: item.ticket.name,
				items: Array.from({ length: item.quantity }, () => ({
					name: "",
					surname: "",
					email: "",
					phone: "",
				})),
			})),
		},
		mode: "onTouched", // ← валидация при потере фокуса
		reValidateMode: "onChange", // ← но после первой ошибки — сразу реагирует
	});

	const { watch, handleSubmit, control, setValue } = form;
	const buyerIsParticipant = watch("buyerIsParticipant");
	const buyerTicketGroupIdx = watch("buyerTicketGroupIdx");
	const buyer = watch("buyer");
	const flatList = buildFlatList(items);

	const copyBuyerEmail = (groupIdx: number, participantIdx: number) => {
		setValue(
			`participants.${groupIdx}.items.${participantIdx}.email`,
			buyer.email,
			{ shouldValidate: true },
		);
	};

	const total = items.reduce(
		(sum, item) => sum + item.ticket.price * item.quantity,
		0,
	);

	const onSubmit = (data: OrderFormValues) => {
		// Если покупатель = участник — подставляем его данные в нужный слот
		const finalParticipants = data.participants.map((group, gi) => ({
			...group,
			items: group.items.map((p, pi) => {
				if (
					data.buyerIsParticipant &&
					gi === data.buyerTicketGroupIdx &&
					pi === 0
				) {
					return { ...data.buyer };
				}
				return p;
			}),
		}));

		onNext({
			buyer: data.buyer,
			buyerIsParticipant: data.buyerIsParticipant,
			participants: finalParticipants,
		});
	};

	return (
		<div className="grid grid-cols-[380px_1fr] gap-6 items-start">
			{/* ЛЕВАЯ КОЛОНКА */}
			<div className="self-start sticky top-18 flex flex-col gap-5">
				<BuyerDetails
					items={items}
					form={form}
					buyerIsParticipant={buyerIsParticipant}
					buyerTicketGroupIdx={buyerTicketGroupIdx}
					onBuyerIsParticipantChange={(v) =>
						setValue("buyerIsParticipant", v)
					}
					onBuyerTicketGroupIdxChange={(v) =>
						setValue("buyerTicketGroupIdx", v)
					}
				/>
				<div className="order-details px-5 flex flex-col gap-5">
					<OrderDetails items={items} total={total} />
					<ReservationTimer
						expiresAt={expiresAt}
						isExpired={isExpired}
						remaining={remaining}
						formatted={formatted}
					/>
				</div>
			</div>

			{/* ПРАВАЯ КОЛОНКА */}
			<div className="flex flex-col gap-4 pt-2">
				<Typography
					variant="h4"
					className="font-semibold flex gap-2 items-center"
				>
					<IconUsers className="size-6 text-primary" />
					Bilety oraz dane uczestników
				</Typography>

				<ParticipantList
					form={form} // ← передаём всю форму
					flatList={flatList}
					items={items}
					buyerIsParticipant={buyerIsParticipant}
					buyerTicketGroupIdx={buyerTicketGroupIdx}
					buyerEmail={buyer.email}
					onCopyBuyerEmail={copyBuyerEmail}
				/>

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
						onClick={handleSubmit(onSubmit)}
						disabled={!form.formState.isValid}
						className="flex-1"
					>
						Dalej
					</Button>
				</div>
			</div>
		</div>
	);
};
