import { cn } from "@/lib/utils";
import { PaymentMethod } from "@prisma/client";
import { ReactNode } from "react";
import { PaymentMethodMeta } from "../payment-methods";
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

// const methodIsDefault: ReactNode = {
// 	true: (
// 		<span className="text-primary flex items-center gap-0.5 text-xs">
// 			Domyślna
// 		</span>
// 	),

// };

export type PaymentMethodsTabsItemType = {
	className?: string;
	data: PaymentMethodMeta;
	isActive: boolean;
	isEnabled: boolean;
	onSelect: (method: PaymentMethod) => void;
};

const PaymentMethodsTabsItem = ({
	className,
	data,
	isActive,
	isEnabled,
	onSelect,
}: PaymentMethodsTabsItemType) => {
	return (
		<div
			onClick={() => onSelect(data.methodName)}
			className={cn(
				"payment-methods-tabs-item flex items-start text-sm gap-2 rounded-lg p-2 px-3 w-full cursor-pointer transition-colors",
				isActive ? "bg-white" : "bg-transparent  hover:bg-white/70",
				className,
			)}
		>
			<data.icon className="size-4 mt-0.5" />
			<div className="payment-methods-tabs-item__data flex flex-col gap-1">
				{data.label}
				{data.methodName !== PaymentMethod.FREE ? (
					methodIsEnabled[String(isEnabled) as "true" | "false"]
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
