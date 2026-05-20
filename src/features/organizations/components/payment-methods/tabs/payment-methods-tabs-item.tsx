import { cn } from "@/lib/utils";
import { PaymentMethod } from "@prisma/client";
import { ReactNode } from "react";
import { PaymentMethodData } from "../payment-methods";
import { IconAutomation, IconCheck } from "@tabler/icons-react";

const methodIsEnabled: Record<"true" | "false", ReactNode> = {
	true: (
		<span className="text-green-600 font-medium flex items-center gap-0.5 text-xs">
			<IconCheck className="size-4"></IconCheck>
			Włączony
		</span>
	),
	false: (
		<span className="text-muted-foreground flex items-center gap-0.5 text-xs">
			Wyłączony
		</span>
	),
};

const PaymentMethodsTabsItem = ({
	className,
	data,
}: {
	className?: string;
	data: PaymentMethodData;
}) => {
	return (
		<div
			onClick={() => data.data.onSelect(data.meta.methodName)}
			className={cn(
				"payment-methods-tabs-item flex items-start text-sm gap-2 rounded-lg p-2 px-3 w-full cursor-pointer transition-colors",
				data.data.isActive ? "bg-white" : "bg-transparent hover:bg-white/70",
				className,
			)}
		>
			<data.meta.icon className="size-4 mt-0.5" />
			<div className="payment-methods-tabs-item__data flex flex-col gap-1">
				{data.meta.label}
				{data.meta.methodName !== PaymentMethod.FREE ? (
					methodIsEnabled[String(data.data.isEnabled) as "true" | "false"]
				) : (
					<span className="text-info font-medium flex items-center gap-0.5 text-xs">
						<IconAutomation className="size-4" />
						Auto
					</span>
				)}
			</div>
		</div>
	);
};

export default PaymentMethodsTabsItem;
