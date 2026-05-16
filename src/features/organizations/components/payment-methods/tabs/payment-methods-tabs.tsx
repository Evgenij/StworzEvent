"use client";

import { cn } from "@/lib/utils";
import PaymentMethodsTabsItem, {
	PaymentMethodsTabsItemType,
} from "./payment-methods-tabs-item";
import { PaymentMethodMeta } from "../payment-methods";
import { PaymentMethod } from "@prisma/client";

const PaymentMethodsTabs = ({
	className,
	paymentMethods,
	enabledPaymentMethods,
	activeMethod,
	onMethodChange,
}: {
	className?: string;
	paymentMethods: PaymentMethodMeta[];
	enabledPaymentMethods: PaymentMethod[];
	activeMethod: PaymentMethodsTabsItemType;
	onMethodChange: (item: PaymentMethodsTabsItemType) => void;
}) => {
	return (
		<div
			className={cn(
				"payment-methods-tabs p-1 rounded-xl bg-muted flex gap-1",
				className,
			)}
		>
			{paymentMethods.map((method) => {
				const isEnabled = enabledPaymentMethods.includes(method.method);
				return (
					<PaymentMethodsTabsItem
						key={method.method}
						data={method}
						isActive={activeMethod.data.method === method.method}
						isEnabled={isEnabled}
						onSelect={() =>
							onMethodChange({
								data: method,
								isActive: true,
								isEnabled,
								onSelect: () => {},
							})
						}
					/>
				);
			})}
		</div>
	);
};

export default PaymentMethodsTabs;
