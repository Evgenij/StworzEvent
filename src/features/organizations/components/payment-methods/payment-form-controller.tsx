import { PaymentMethod } from "@prisma/client";
import BankTransferMethodForm from "../forms/payment-methods/bank-transfer-method-form";
import ExternalLinkMethodForm from "../forms/payment-methods/external-link-method-form";
import CashAtEntranceMethodForm from "../forms/payment-methods/cash-at-entrance-method-form";
import FreeMethodForm from "../forms/payment-methods/free-method-form";
import { PaymentMethodData } from "./payment-methods";

const PaymentFormController = ({
	method,
	className,
	toggleMethod,
}: {
	method: PaymentMethodData;
	className?: string;
	toggleMethod: (method: PaymentMethod, enabled: boolean) => Promise<void>;
}) => {
	const forms = {
		[PaymentMethod.BANK_TRANSFER]: (
			<BankTransferMethodForm
				organizationId={method.data.organizationId}
				data={method}
				toggleMethod={toggleMethod}
			/>
		),
		[PaymentMethod.EXTERNAL_LINK]: (
			<ExternalLinkMethodForm
				organizationId={method.data.organizationId}
				data={method}
				toggleMethod={toggleMethod}
			/>
		),
		[PaymentMethod.CASH_AT_ENTRANCE]: (
			<CashAtEntranceMethodForm
				organizationId={method.data.organizationId}
				data={method}
				toggleMethod={toggleMethod}
			/>
		),
		[PaymentMethod.FREE]: (
			<FreeMethodForm
				organizationId={method.data.organizationId}
				data={method}
				toggleMethod={toggleMethod}
			/>
		),
	};

	return (
		<section className="payment-method-form-controller flex flex-col gap-5">
			{forms[method.meta.methodName]}
		</section>
	);
};

export default PaymentFormController;
