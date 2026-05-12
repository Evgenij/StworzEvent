import { Typography } from "@/shared/components";
import { PaymentMethod } from "@prisma/client";
import {
	IconBuildingBank,
	IconCameraUp,
	IconCopy,
	IconCreditCard,
	IconQrcode,
} from "@tabler/icons-react";
import React from "react";
import PaymentMethodTransfer from "./payment-method/payment-method-transfer";
import PaymentMethodCash from "./payment-method/payment-method-cash";
import PaymentMethodExternalLink from "./payment-method/payment-method-external-link";

// type PaymentType = {
// 	key: PaymentMethod;
// 	icon: React.ElementType;
// 	label: string;
// };

// const PAYMENT_METHODS: Partial<Record<PaymentMethod, PaymentType>> = {
// 	BANK_TRANSFER: {
// 		key: "BANK_TRANSFER",
// 		icon: IconBuildingBank,
// 		label: "Przelew bankowy",
// 	},
// 	EXTERNAL_LINK: {
// 		key: "EXTERNAL_LINK",
// 		icon: IconCreditCard,
// 		label: "Link płatności",
// 	},
// 	CASH_AT_ENTRANCE: {
// 		key: "CASH_AT_ENTRANCE",
// 		icon: IconCameraUp,
// 		label: "Opłata przy wejściu",
// 	},
// 	FREE: { key: "FREE", icon: IconQrcode, label: "Bezpłatne" },
// };

// const getPaymentType = (paymentMethod?: PaymentMethod): PaymentType =>
// 	PAYMENT_METHODS[paymentMethod ?? "BANK_TRANSFER"] ??
// 	PAYMENT_METHODS["BANK_TRANSFER"]!;

const PaymentInstruction = ({
	paymentMethod,
}: {
	paymentMethod: PaymentMethod;
}) => {
	// const Payment = getPaymentType(paymentMethod);

	const PaymentMethods = {
		[PaymentMethod.BANK_TRANSFER]: <PaymentMethodTransfer />,
		[PaymentMethod.CASH_AT_ENTRANCE]: <PaymentMethodCash />,
		[PaymentMethod.EXTERNAL_LINK]: <PaymentMethodExternalLink />,
		[PaymentMethod.FREE]: null,
	};

	return PaymentMethods[paymentMethod];
};

export default PaymentInstruction;
