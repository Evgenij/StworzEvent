"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Typography } from "@/shared/components";
import { OrderStatus, PaymentMethod } from "@prisma/client";
import {
	IconArrowNarrowDown,
	IconBan,
	IconBuildingBank,
	IconCameraUp,
	IconCircleCheck,
	IconCircleCheckFilled,
	IconClock,
	IconClockHour2Filled,
	IconClockOff,
	IconCopy,
	IconCreditCard,
	IconDownload,
	IconFileText,
	IconQrcode,
	IconShieldCheck,
	IconShieldCheckFilled,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import PaymentInstruction from "./payment/payment-instruction";
import PaymentConfirmation from "./payment/payment-confirmation";

type ActionButton = {
	icon: React.ElementType;
	label: string;
	variant: "outline" | "default" | "ghost";
	disabled?: boolean;
};

const STATUS_ACTIONS: Partial<Record<OrderStatus, ActionButton[]>> = {
	PENDING: [
		{
			icon: IconCreditCard,
			label: "Instrukcja płatności",
			variant: "ghost",
		},
	],
	CONFIRMED: [
		{ icon: IconDownload, label: "Pobierz bilety", variant: "outline" },
	],
	PAID: [
		{
			icon: IconFileText,
			label: "Szczegóły platnosci",
			variant: "outline",
		},
	],
	CANCELLED: [],
	EXPIRED: [],
};

type StatusStep = {
	key: OrderStatus;
	icon: React.ElementType;
	color: string;
	bg: string;
};

const STATUS_STEPS: StatusStep[] = [
	{
		key: "PENDING",
		icon: IconClockHour2Filled,
		color: "text-orange-500",
		bg: "bg-orange-100 dark:bg-orange-950",
	},
	{
		key: "CONFIRMED",
		icon: IconShieldCheckFilled,
		color: "text-green-600",
		bg: "bg-green-100 dark:bg-green-950",
	},
	{
		key: "PAID",
		icon: IconCircleCheckFilled,
		color: "text-blue-600",
		bg: "bg-blue-100 dark:bg-blue-950",
	},
];

const TERMINAL_STATUSES: Partial<Record<OrderStatus, StatusStep>> = {
	CANCELLED: {
		key: "CANCELLED",
		icon: IconBan,
		color: "text-red-500",
		bg: "bg-red-100 dark:bg-red-950",
	},
	EXPIRED: {
		key: "EXPIRED",
		icon: IconClockOff,
		color: "text-gray-600",
		bg: "bg-gray-100 dark:bg-gray-900",
	},
};

const getTriggerConfig = (status: OrderStatus): StatusStep => {
	if (TERMINAL_STATUSES[status]) return TERMINAL_STATUSES[status]!;
	return STATUS_STEPS.find((s) => s.key === status) ?? STATUS_STEPS[0];
};

const OrderTicketStatus = ({
	className,
	status,
	paymentMethod,
}: {
	className?: string;
	status: OrderStatus;
	paymentMethod: PaymentMethod;
}) => {
	const t = useTranslations("OrderTicketStatus");
	const trigger = getTriggerConfig(status);
	const TriggerIcon = trigger.icon;

	return (
		<div
			className={cn(
				"order-status flex items-center justify-between",
				className,
			)}
		>
			<Accordion type="single" collapsible className="w-full">
				<AccordionItem value="status">
					<AccordionTrigger className="hover:no-underline items-center gap-2 p-0">
						<div className="order-status-trigger w-full flex justify-between items-center">
							<div
								className={cn(
									"text-xs flex items-center gap-0.5 p-1.5 pr-2.5 rounded-full",
									trigger.color,
									trigger.bg,
								)}
							>
								{status !== OrderStatus.PAID ? (
									<TriggerIcon className="size-4" />
								) : (
									<span className="relative flex size-2.5 ml-1 mr-0.5">
										<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75"></span>
										<span className="relative inline-flex size-2.5 rounded-full bg-blue-500"></span>
									</span>
								)}

								{t(status)}
							</div>

							<div className="flex gap-1">
								{(STATUS_ACTIONS[status] ?? []).map(
									(action) => (
										<div
											className="flex items-center gap-1"
											key={action.label}
										>
											<action.icon className="size-4" />
											{action.label}
										</div>
									),
								)}
							</div>
						</div>
					</AccordionTrigger>

					<AccordionContent className="h-fit p-2 pt-3 flex flex-col gap-4">
						<PaymentInstruction paymentMethod={paymentMethod} />
						<PaymentConfirmation />
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
};

export default OrderTicketStatus;
