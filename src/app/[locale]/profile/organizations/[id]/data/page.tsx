"use client";

import { OrganizationGeneralForm } from "@/features/organizations/components/organization-general-form";
import { useOrganization } from "@/features/organizations/context/organization-context";
import { Typography } from "@/shared/components";
import { IconClock } from "@tabler/icons-react";

export default async function OrganizationDataPage() {
	const org = useOrganization();

	console.log(org);

	return (
		<section className="organization-data-page  border border-border rounded-2xl bg-background">
			<header className="flex justify-between items-start px-6 py-5 border-b border-border sticky -top-5 bg-background rounded-t-2xl">
				<div>
					<Typography variant="h2">Dane organizacji</Typography>
					<p className="text-sm text-muted-foreground">
						Podstawowe informacje, dane prawne i kontaktowe
					</p>
				</div>
				<div className="text-xs text-muted-foreground flex items-center gap-1">
					<IconClock className="size-4" />
					<span>Zmieniono 4 lutego 2026</span>
				</div>
			</header>
			<main className="p-5">
				<OrganizationGeneralForm
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
