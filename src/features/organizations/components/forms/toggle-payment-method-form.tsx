import { cn } from "@/lib/utils";

const TogglePaymentMethodForm = ({
	className,
	active,
}: {
	className?: string;
	active?: boolean;
}) => {
	return (
		<div
			className={cn(
				"toggle-payment-method-form flex items-center gap-2 border",
				active ? "border-primary" : "border-muted",
				active ? "bg-primary-50" : "bg-muted",
				className,
			)}
		>
			toggle-payment-method-form
		</div>
	);
};

export default TogglePaymentMethodForm;
