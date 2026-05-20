"use client";

import { cn } from "@/lib/utils";
import PaymentMethodsTabsItem from "./payment-methods-tabs-item";
import { PaymentMethodData, PaymentMethodTabMetaType } from "../payment-methods";
import { PaymentMethod } from "@prisma/client";

const PaymentMethodsTabs = ({
	className,
	paymentMethods,
	enabledPaymentMethods,
	activeMethod,
	onMethodChange,
}: {
	className?: string;
	paymentMethods: PaymentMethodTabMetaType[];
	enabledPaymentMethods: PaymentMethod[];
	activeMethod: PaymentMethodData;
	onMethodChange: (item: PaymentMethodData) => void;
}) => {
	return (
		<div
			className={cn(
				"payment-methods-tabs p-1 rounded-xl bg-muted flex gap-1",
				className,
			)}
		>
			{paymentMethods.map((method) => {
				const isEnabled = enabledPaymentMethods.includes(method.methodName);
				return (
					<PaymentMethodsTabsItem
						key={method.methodName}
						data={{
							meta: method,
							data: {
								organizationId: activeMethod.data.organizationId,
								isActive:
									activeMethod.meta.methodName === method.methodName,
								isEnabled,
								config: activeMethod.data.config,
								onSelect: () =>
									onMethodChange({
										meta: method,
										data: {
											organizationId: activeMethod.data.organizationId,
											isActive: true,
											isEnabled,
											onSelect: () => {},
											config: activeMethod.data.config,
										},
									}),
							},
						}}
					/>
				);
			})}
		</div>
	);
};

export default PaymentMethodsTabs;
