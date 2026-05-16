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
	activeMethod,
}: {
	className?: string;
	activeMethod: PaymentMethodsTabsItemType;
}) => {
	return (
		// <div
		// 	className={cn(
		// 		"payment-method-toggle-item flex items-center gap-1 p-2 px-3 rounded-lg cursor-pointer transition-all border",
		// 		{
		// 			"bg-muted border-border": !activeMethod.isEnabled,
		// 			"bg-primary/20 border-primary/30 text-primary":
		// 				activeMethod.isEnabled,
		// 		},
		// 		className,
		// 	)}
		// >
		// 	<activeMethod.data.icon className="size-6" />
		// 	<Typography variant="h4">{activeMethod?.data.label}</Typography>
		// </div>
		<FieldLabel htmlFor="switch-notifications" className="p-0">
			<Field orientation="horizontal">
				<FieldContent className="flex flex-row items-center gap-2 p-1">
					<activeMethod.data.icon
						className={cn("size-6", {
							"text-primary": activeMethod.isEnabled,
						})}
					/>
					<div className="flex flex-col">
						<FieldTitle
							className={cn("", {
								"text-orange-600": activeMethod.isEnabled,
							})}
						>
							{activeMethod.data.label}
						</FieldTitle>
						<FieldDescription className="m-0">
							{activeMethod.data.description}
						</FieldDescription>
					</div>
				</FieldContent>
				{activeMethod.data.method === PaymentMethod.FREE ? (
					<Badge variant="success">Automatyczne</Badge>
				) : (
					<Switch
						id="switch-notifications"
						checked={activeMethod.isEnabled}
					/>
				)}
			</Field>
		</FieldLabel>
	);
};

export default PaymentMethodToggleItem;
