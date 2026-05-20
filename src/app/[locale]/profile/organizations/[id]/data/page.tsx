"use client";

import { UpdateOrganizationForm } from "@/features/organizations/components/forms/update-organization-form";
import PaymentMethods from "@/features/organizations/components/payment-methods/payment-methods";
import { useOrganization } from "@/features/organizations/context/organization-context";
import { Typography } from "@/shared/components";
import { PaymentMethod } from "@prisma/client";
import { IconBuilding, IconCashRegister, IconClock } from "@tabler/icons-react";

export default function OrganizationDataPage() {
	const org = useOrganization();

	return (
		<section className="organization-data-page flex flex-col gap-4">
			<section className="main-data border border-border rounded-2xl bg-background">
				<header className="flex justify-between items-start px-6 py-5 border-b border-border sticky -top-5 bg-background rounded-t-2xl z-10">
					<div className="content flex items-center gap-3">
						<div className="content__icon p-3 text-primary bg-primary/20 rounded-lg">
							<IconBuilding />
						</div>

						<div className="content__data	">
							<Typography variant="h2">
								Dane organizacji
							</Typography>
							<p className="text-sm text-muted-foreground">
								Podstawowe informacje, dane prawne i kontaktowe
							</p>
						</div>
					</div>
					<div className="text-xs text-muted-foreground flex items-center gap-1">
						<IconClock className="size-4" />
						<span>Zmieniono 4 lutego 2026</span>
					</div>
				</header>
				<main className="p-5">
					<UpdateOrganizationForm
						organizationId={org.id}
						initialData={{
							name: org.name,
							nip: org.nip,
							regon: org.regon,
							krs: org.krs,
							legalForm: org.legalForm,
							legalFormCode: org.legalFormCode,
							vatStatus: org.vatStatus,
							vatId: org.vatId,
							website: org.website,
							phone: org.phone,
							email: org.email,
							industry: org.industry,
							mainPkdCode: org.mainPkdCode,
							employeeCountRange: org.employeeCountRange,
						}}
					/>
				</main>
			</section>
			{/* <section className="payment-data border border-border rounded-2xl bg-background">
				<header className="flex justify-between items-start px-6 py-5 border-b border-border sticky -top-5 bg-background rounded-t-2xl">
					<div className="content flex items-center gap-3">
						<div className="content__icon p-3 text-primary bg-primary/20 rounded-lg">
							<IconCashRegister />
						</div>

						<div className="content__data	">
							<Typography variant="h2">
								Metody płatności
							</Typography>
							<p className="text-sm text-muted-foreground">
								Włącz metody i ustaw jedną jako domyślną dla
								nowych wydarzeń
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
			</section> */}
		</section>
	);
}
{
	/* <section className="flex max-w-5xl mx-auto flex-col gap-4">
				<div>
					<h2 className="text-lg font-semibold">Metody płatności</h2>
					<p className="text-sm text-muted-foreground">
						Domyślna metoda płatności dla wydarzeń tej organizacji
					</p>
				</div>
				<OrganizationPaymentForm
					organizationId={org.id}
					initialData={{
						defaultPaymentMethod: org.defaultPaymentMethod,
						defaultBankAccountNumber: org.defaultBankAccountNumber,
						defaultBankAccountHolder: org.defaultBankAccountHolder,
						defaultPaymentLink: org.defaultPaymentLink,
						defaultPaymentInstructions:
							org.defaultPaymentInstructions,
					}}
				/>
			</section> */
}
