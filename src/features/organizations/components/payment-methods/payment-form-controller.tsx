import { cn } from "@/lib/utils";
import { PaymentMethod } from "@prisma/client";
import BankTransferMethodForm from "../forms/payment-methods/bank-transfer-method-form";

const PaymentFormController = ({
	method,
	className,
}: {
	method: PaymentMethod;
	className?: string;
}) => {
	const methods = {
		[PaymentMethod.BANK_TRANSFER]: <BankTransferMethodForm />,
		[PaymentMethod.EXTERNAL_LINK]: <div>external link</div>,
		[PaymentMethod.CASH_AT_ENTRANCE]: <div>cash at entrance</div>,
		[PaymentMethod.FREE]: <div>free</div>,
	};

	return methods[method];
};

export default PaymentFormController;
