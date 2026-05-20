import { cn } from "@/lib/utils";
import { PaymentMethod } from "@prisma/client";
import BankTransferMethodForm from "../forms/payment-methods/bank-transfer-method-form";
import PaymentMethodToggleItem from "./toggle-item";
import { PaymentMethodsTabsItemType } from "./tabs/payment-methods-tabs-item";

const PaymentFormController = ({
	method,
	className,
}: {
	method: PaymentMethodsTabsItemType;
	className?: string;
}) => {
	const methods = {
		[PaymentMethod.BANK_TRANSFER]: <BankTransferMethodForm />,
		[PaymentMethod.EXTERNAL_LINK]: <div>external link</div>,
		[PaymentMethod.CASH_AT_ENTRANCE]: <div>cash at entrance</div>,
		[PaymentMethod.FREE]: <div>free</div>,
	};

	return (
		<section className="payment-method-form-controller flex flex-col gap-5">
			<PaymentMethodToggleItem
				method={method}
				isEnabled={method.isEnabled}
			/>
			{methods[method.data.methodName]}
		</section>
	);
};

export default PaymentFormController;
