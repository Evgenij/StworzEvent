"use client";

import PaymentMethods from "@/features/organizations/components/payment-methods/payment-methods";
import { useOrganization } from "@/features/organizations/context/organization-context";
import { cn } from "@/lib/utils";
import { Typography } from "@/shared/components";
import { PaymentMethod } from "@prisma/client";
import { IconCashRegister, IconClock } from "@tabler/icons-react";

const PaymentMethodsPage = () => {
	const org = useOrganization();

	return (
		<div
			className={cn(
				"payment-methods-page border border-border rounded-2xl bg-background",
			)}
		>
			<header className="flex justify-between items-start px-6 py-5 border-b border-border sticky -top-5 bg-background rounded-t-2xl">
				<div className="content flex items-center gap-3">
					<div className="content__icon p-3 text-primary bg-primary/20 rounded-lg">
						<IconCashRegister />
					</div>

					<div className="content__data	">
						<Typography variant="h2">Metody płatności</Typography>
						<p className="text-sm text-muted-foreground">
							Włącz metody i ustaw jedną jako domyślną dla nowych
							wydarzeń
						</p>
					</div>
				</div>
				<div className="text-xs text-muted-foreground flex items-center gap-1">
					<IconClock className="size-4" />
					<span>Zmieniono 4 lutego 2026</span>
				</div>
			</header>
			<main className="p-5">
				<PaymentMethods
					enabledPaymentMethods={
						org.enabledPaymentMethods as PaymentMethod[]
					}
				/>
			</main>
		</div>
	);
};

export default PaymentMethodsPage;
