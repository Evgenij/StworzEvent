import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { OrganizationPaymentForm } from "@/features/organizations/components/organization-payment-form";
import { OrganizationGeneralForm } from "@/features/organizations/components/organization-general-form";
import { OrganizationLogoUpload } from "@/features/organizations/components/organization-logo-upload";

type Props = {
	params: Promise<{ id: string }>;
};

export default async function OrganizationSettingsPage({ params }: Props) {
	const { id } = await params;

	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) notFound();

	const org = await prisma.organization.findFirst({
		where: {
			id,
			organizationMembers: { some: { userId: session.user.id } },
		},
		select: {
			id: true,
			name: true,
			logo: true,
			nip: true,
			regon: true,
			krs: true,
			legalForm: true,
			legalFormCode: true,
			vatStatus: true,
			vatId: true,
			website: true,
			phone: true,
			email: true,
			industry: true,
			mainPkdCode: true,
			employeeCountRange: true,
			defaultPaymentMethod: true,
			defaultBankAccountNumber: true,
			defaultBankAccountHolder: true,
			defaultPaymentLink: true,
			defaultPaymentInstructions: true,
		},
	});

	if (!org) notFound();

	return (
		<div className="max-w-2xl mx-auto py-8 px-4 flex flex-col gap-10">
			<div className="flex items-center gap-5">
				<OrganizationLogoUpload
					organizationId={org.id}
					organizationName={org.name}
					initialLogo={org.logo}
				/>
				<div>
					<h1 className="text-2xl font-bold">{org.name}</h1>
					<p className="text-muted-foreground text-sm mt-1">
						Ustawienia organizacji
					</p>
				</div>
			</div>

			<section className="flex flex-col gap-4">
				<div>
					<h2 className="text-lg font-semibold">Dane organizacji</h2>
					<p className="text-sm text-muted-foreground">
						Podstawowe informacje, dane prawne i kontaktowe
					</p>
				</div>
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
			</section>

			<section className="flex flex-col gap-4">
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
						defaultPaymentInstructions: org.defaultPaymentInstructions,
					}}
				/>
			</section>
		</div>
	);
}
