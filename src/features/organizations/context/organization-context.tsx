"use client";

import { createContext, useContext } from "react";
import {
	EmployeeCountRange,
	LegalForm,
	VatStatus,
} from "@prisma/client";

export type OrganizationData = {
	id: string;
	name: string;
	logo: string | null;
	nip: string | null;
	regon: string | null;
	krs: string | null;
	legalForm: LegalForm | null;
	legalFormCode: string | null;
	vatStatus: VatStatus | null;
	vatId: string | null;
	website: string | null;
	phone: string | null;
	email: string | null;
	industry: string | null;
	mainPkdCode: string | null;
	employeeCountRange: EmployeeCountRange | null;
	enabledPaymentMethods: string[];
	defaultPaymentMethod: string | null;
	defaultBankAccountNumber: string | null;
	defaultBankAccountHolder: string | null;
	defaultBankName: string | null;
	bankTransferInstructions: string | null;
	defaultPaymentLink: string | null;
	externalLinkInstructions: string | null;
	cashAtEntranceInstructions: string | null;
	freeInstructions: string | null;
};

const OrganizationContext = createContext<OrganizationData | null>(null);

export function OrganizationProvider({
	children,
	organization,
}: {
	children: React.ReactNode;
	organization: OrganizationData;
}) {
	return (
		<OrganizationContext.Provider value={organization}>
			{children}
		</OrganizationContext.Provider>
	);
}

export function useOrganization(): OrganizationData {
	const ctx = useContext(OrganizationContext);
	if (!ctx)
		throw new Error("useOrganization must be used within OrganizationProvider");
	return ctx;
}
