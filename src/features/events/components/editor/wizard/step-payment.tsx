"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { IconInfoCircle } from "@tabler/icons-react";
import { toast } from "sonner";
import { EventPaymentForm } from "@/features/events/components/payment/event-payment-form";
import { updateEventPaymentAction } from "@/features/events/actions/update-event-payment.action";
import type { EventPaymentData } from "@/features/events/actions/get-event-payment.action";

type Props = {
	eventId: string;
	initialPayment: EventPaymentData;
};

export function StepPayment({ eventId, initialPayment }: Props) {
	const t = useTranslations("EventWizard.payment");
	const tErrors = useTranslations("EventWizard.payment.errors");

	const hasOverride = Boolean(initialPayment.paymentMethod);
	const [showForm, setShowForm] = useState(hasOverride);

	const handleReset = async () => {
		const result = await updateEventPaymentAction({
			eventId,
			data: {
				paymentMethod: null,
				bankAccountNumber: null,
				bankAccountHolder: null,
				paymentLink: null,
				paymentInstructions: null,
			},
		});
		if (!result.success) {
			toast.error(tErrors("default"));
			return;
		}
		toast.success(t("saved"));
		setShowForm(false);
	};

	const org = initialPayment.organization;
	const hasOrgDefaults = Boolean(org.defaultPaymentMethod);

	return (
		<div className="flex flex-col gap-4">
			{!showForm && (
				<div className="flex items-start gap-3 p-4 rounded-lg border bg-muted/30">
					<IconInfoCircle className="size-5 text-muted-foreground mt-0.5 shrink-0" />
					<div className="flex-1 flex flex-col gap-2">
						<p className="text-sm">
							{hasOrgDefaults
								? t("usingDefaults")
								: "Brak domyślnej metody płatności w organizacji"}
						</p>
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="w-fit"
							onClick={() => setShowForm(true)}
						>
							{t("overrideDefaults")}
						</Button>
					</div>
				</div>
			)}

			{showForm && (
				<>
					{hasOrgDefaults && (
						<div className="flex justify-end">
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={handleReset}
							>
								{t("resetToDefaults")}
							</Button>
						</div>
					)}
					<EventPaymentForm
						eventId={eventId}
						initialData={{
							paymentMethod: initialPayment.paymentMethod,
							bankAccountNumber: initialPayment.bankAccountNumber,
							bankAccountHolder: initialPayment.bankAccountHolder,
							paymentLink: initialPayment.paymentLink,
							paymentInstructions:
								initialPayment.paymentInstructions,
						}}
					/>
				</>
			)}
		</div>
	);
}
