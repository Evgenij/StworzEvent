import { cn } from "@/lib/utils";
import { PaymentMethod } from "@prisma/client";
import { PaymentMethodsTabsItemType } from "./tabs/payment-methods-tabs-item";
import { Typography } from "@/shared/components";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldLabel,
	FieldTitle,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

const PaymentMethodToggleItem = ({
	className,
	method,
	isEnabled,
}: {
	className?: string;
	method: PaymentMethodsTabsItemType;
	isEnabled: boolean;
}) => {
	return (
		<FieldLabel htmlFor="switch-notifications" className="p-0">
			<Field orientation="horizontal">
				<FieldContent className="flex flex-row items-center gap-2 p-1">
					<method.data.icon
						className={cn("size-6", {
							"text-primary": isEnabled,
						})}
					/>
					<div className="flex flex-col">
						<FieldTitle
							className={cn("", {
								"text-orange-600": isEnabled,
							})}
						>
							{method.data.label}
						</FieldTitle>
						<FieldDescription className="m-0">
							{method.data.description}
						</FieldDescription>
					</div>
				</FieldContent>
				{method.data.methodName === PaymentMethod.FREE ? (
					<Badge variant="info">Automatyczne</Badge>
				) : (
					<Switch id="switch-notifications" checked={isEnabled} />
				)}
			</Field>
		</FieldLabel>
	);
};

export default PaymentMethodToggleItem;
