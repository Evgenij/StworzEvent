"use client";

import { useState, useMemo, useEffect } from "react";
import { togglePaymentMethodAction } from "../../actions/payment-methods/toggle-payment-method.action";
import { cn } from "@/lib/utils";
import PaymentMethodsTabs from "./tabs/payment-methods-tabs";
import { PaymentMethod } from "@prisma/client";
import { ElementType } from "react";
import {
	IconBuildingBank,
	IconCashBanknote,
	IconExternalLink,
	IconFreeRights,
} from "@tabler/icons-react";
import PaymentFormController from "./payment-form-controller";
import { useOrganization } from "../../context/organization-context";

export type PaymentMethodTabMetaType = {
	methodName: PaymentMethod;
	label: string;
	description: string;
	icon: ElementType;
};

const paymentMethodsList: PaymentMethodTabMetaType[] = [
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

export type BankTransferConfig = {
	bankAccountNumber: string | null;
	bankAccountHolder: string | null;
	bankName: string | null;
	instructions: string | null;
};

export type ExternalLinkConfig = {
	paymentLink: string | null;
	instructions: string | null;
};

export type CashAtEntranceConfig = {
	instructions: string | null;
};

export type FreeConfig = {
	instructions: string | null;
};

export type PaymentMethodData = {
	meta: PaymentMethodTabMetaType;
	data: {
		organizationId: string;
		className?: string;
		isActive: boolean;
		isEnabled: boolean;
		onSelect: (method: PaymentMethod) => void;
		config: {
			bankTransfer: BankTransferConfig;
			externalLink: ExternalLinkConfig;
			cashAtEntrance: CashAtEntranceConfig;
			free: FreeConfig;
		};
	};
};

const PaymentMethods = ({ className }: { className?: string }) => {
	const org = useOrganization();

	const sharedConfig = useMemo(
		() => ({
			bankTransfer: {
				bankAccountNumber: org.defaultBankAccountNumber,
				bankAccountHolder: org.defaultBankAccountHolder,
				bankName: org.defaultBankName,
				instructions: org.bankTransferInstructions,
			},
			externalLink: {
				paymentLink: org.defaultPaymentLink,
				instructions: org.externalLinkInstructions,
			},
			cashAtEntrance: {
				instructions: org.cashAtEntranceInstructions,
			},
			free: {
				instructions: org.freeInstructions,
			},
		}),
		[
			org.defaultBankAccountNumber,
			org.defaultBankAccountHolder,
			org.defaultBankName,
			org.bankTransferInstructions,
			org.defaultPaymentLink,
			org.externalLinkInstructions,
			org.cashAtEntranceInstructions,
			org.freeInstructions,
		],
	);

	useEffect(() => {
		setActiveMethod((prev) => ({
			...prev,
			data: { ...prev.data, config: sharedConfig },
		}));
	}, [sharedConfig]);

	const [enabledMethods, setEnabledMethods] = useState<PaymentMethod[]>(
		org.enabledPaymentMethods as PaymentMethod[],
	);

	const [activeMethod, setActiveMethod] = useState<PaymentMethodData>({
		meta: paymentMethodsList[0],
		data: {
			organizationId: org.id,
			isActive: true,
			isEnabled: (org.enabledPaymentMethods as PaymentMethod[]).includes(
				paymentMethodsList[0].methodName,
			),
			onSelect: () => {},
			config: sharedConfig,
		},
	});

	const handleToggle = async (method: PaymentMethod, enabled: boolean) => {
		setEnabledMethods((prev) =>
			enabled
				? ([...new Set([...prev, method])] as PaymentMethod[])
				: prev.filter((m) => m !== method),
		);

		if (activeMethod.meta.methodName === method) {
			setActiveMethod((prev) => ({
				...prev,
				data: { ...prev.data, isEnabled: enabled },
			}));
		}

		await togglePaymentMethodAction({
			organizationId: org.id,
			method,
			enabled,
		});
	};

	return (
		<div className={cn("payment-methods flex flex-col gap-2", className)}>
			<PaymentMethodsTabs
				paymentMethods={paymentMethodsList}
				enabledPaymentMethods={enabledMethods}
				activeMethod={activeMethod}
				onMethodChange={setActiveMethod}
			/>
			<PaymentFormController
				method={activeMethod}
				toggleMethod={handleToggle}
			/>
		</div>
	);
};

export default PaymentMethods;
