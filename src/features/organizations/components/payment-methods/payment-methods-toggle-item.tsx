import { cn } from "@/lib/utils";
import { PaymentMethod } from "@prisma/client";
import { PaymentMethodData } from "./payment-methods";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldLabel,
	FieldTitle,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const PaymentMethodToggleItem = ({
	className,
	method,
	toggleMethod,
}: {
	className?: string;
	method: PaymentMethodData;
	toggleMethod: (methodName: PaymentMethod, value: boolean) => Promise<void>;
}) => {
	const [isEnabled, setIsEnabled] = useState(method.data.isEnabled);

	return (
		<FieldLabel
			htmlFor="switch-notifications"
			className={cn("p-0", {
				"border bg-info/5 border-info/60":
					method.meta.methodName === PaymentMethod.FREE,
			})}
		>
			<Field orientation="horizontal">
				<FieldContent className="flex flex-row items-center gap-2 p-1">
					<method.meta.icon
						className={cn("size-6", {
							"text-primary": isEnabled,
							"text-info":
								method.meta.methodName === PaymentMethod.FREE,
						})}
					/>
					<div className="flex flex-col">
						<FieldTitle
							className={cn("", {
								"text-orange-600": isEnabled,
								"text-info":
									method.meta.methodName ===
									PaymentMethod.FREE,
							})}
						>
							{method.meta.label}
						</FieldTitle>
						<FieldDescription className="m-0">
							{method.meta.description}
						</FieldDescription>
					</div>
				</FieldContent>
				{method.meta.methodName === PaymentMethod.FREE ? (
					<Badge variant="info">Automatyczne</Badge>
				) : (
					<Switch
						id="switch-notifications"
						checked={isEnabled}
						onCheckedChange={async (enabled) => {
							setIsEnabled(enabled);
							try {
								await toggleMethod(
									method.meta.methodName,
									enabled,
								);
							} catch {
								setIsEnabled(!enabled);
							}
						}}
					/>
				)}
			</Field>
		</FieldLabel>
	);
};

export default PaymentMethodToggleItem;
