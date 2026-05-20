"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import PaymentMethodsTabs from "./tabs/payment-methods-tabs";
import PaymentMethodToggleItem from "./toggle-item";
import { PaymentMethod } from "@prisma/client";
import { ElementType } from "react";
import {
	IconBuildingBank,
	IconCash,
	IconCashBanknote,
	IconExternalLink,
	IconFreeRights,
} from "@tabler/icons-react";
import { PaymentMethodsTabsItemType } from "./tabs/payment-methods-tabs-item";
import PaymentFormController from "./payment-form-controller";
import { useOrganization } from "../../context/organization-context";

export type PaymentMethodMeta = {
	methodName: PaymentMethod;
	label: string;
	description: string;
	icon: ElementType;
};

const paymentMethodsList: PaymentMethodMeta[] = [
	{
		methodName: PaymentMethod.BANK_TRANSFER,
		label: "Przelew bankowy",
		description:
			"Uczestnicy wykonają przelew na podane konto bankowe — bilet aktywuje się po Twojej weryfikacji.",
		icon: IconBuildingBank,
	},
	{
		methodName: PaymentMethod.EXTERNAL_LINK,
		label: "Link zewnętrzny",
		description:
			"Uczestnicy zostaną przekierowani do zewnętrznej strony płatności (np. Stripe, PayPal, własna bramka).",
		icon: IconExternalLink,
	},
	{
		methodName: PaymentMethod.CASH_AT_ENTRANCE,
		label: "Gotówka",
		description:
			"Uczestnicy płacą gotówką przy wejściu na wydarzenie. Bilet otrzymują od razu po rejestracji.",
		icon: IconCashBanknote,
	},
	{
		methodName: PaymentMethod.FREE,
		label: "Darmowe",
		description:
			"Włącza się automatycznie dla wydarzeń bez biletów płatnych — uczestnik otrzymuje bilet od razu po wypełnieniu formularza.",
		icon: IconFreeRights,
	},
];

const PaymentMethods = ({ className }: { className?: string }) => {
	const org = useOrganization();

	const [activeMethod, setActiveMethod] =
		useState<PaymentMethodsTabsItemType>({
			data: {
				...paymentMethodsList[0],
			},
			isActive: true,
			isEnabled: true,
			onSelect: (method) => {},
		});

	return (
		<div className={cn("payment-methods flex flex-col gap-2", className)}>
			<PaymentMethodsTabs
				paymentMethods={paymentMethodsList}
				enabledPaymentMethods={
					org.enabledPaymentMethods as PaymentMethod[]
				}
				activeMethod={activeMethod}
				onMethodChange={setActiveMethod}
			/>
			<PaymentFormController method={activeMethod} />
		</div>
	);
};

export default PaymentMethods;
