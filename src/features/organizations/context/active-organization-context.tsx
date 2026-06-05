"use client";

import { createContext, useContext, useState } from "react";

type OrgInfo = {
	id: string;
	name: string;
	logo: string | null;
	slug: string;
};

type ActiveOrganizationContextType = {
	activeOrganization: OrgInfo | null;
	setActiveOrganization: (org: OrgInfo | null) => void;
};

const ActiveOrganizationContext = createContext<
	ActiveOrganizationContextType | undefined
>(undefined);

export function ActiveOrganizationProvider({
	children,
	defaultOrganization = null,
}: {
	children: React.ReactNode;
	defaultOrganization?: OrgInfo | null;
}) {
	const [activeOrganization, setActiveOrganization] = useState<OrgInfo | null>(
		defaultOrganization,
	);

	return (
		<ActiveOrganizationContext.Provider
			value={{ activeOrganization, setActiveOrganization }}
		>
			{children}
		</ActiveOrganizationContext.Provider>
	);
}

export function useActiveOrganization() {
	const ctx = useContext(ActiveOrganizationContext);
	if (!ctx)
		throw new Error(
			"useActiveOrganization must be used within ActiveOrganizationProvider",
		);
	return ctx;
}
