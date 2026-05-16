import { ORGANIZATION_PLAN_ROUTE, SIGNIN_ROUTE } from "@/config/routes";
import { HeaderWrapper } from "@/features/layout";
import { OrganizationProvider } from "@/features/organizations/context/organization-context";
import { OrganizationLogoUpload } from "@/features/organizations/components/organization-logo-upload";
import { OrganizationPageNavigation } from "@/features/organizations/layout";
import { Link, redirect } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import React from "react";
import { Typography } from "@/shared/components";
import { Badge } from "@/components/ui/badge";
import { IconArrowsUpRight, IconArrowUpRight } from "@tabler/icons-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
	title: "StworzEvent.pl - Dane organizacji",
	description: "Dane organizacji w StworzEvent.pl",
};

const OrganizationDataLayout = async ({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string; id: string }>;
}) => {
	const { locale, id } = await params;
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		redirect({ href: SIGNIN_ROUTE, locale });
		return null;
	}

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
			enabledPaymentMethods: true,
			defaultPaymentMethod: true,
			defaultBankAccountNumber: true,
			defaultBankAccountHolder: true,
			defaultBankName: true,
			bankTransferInstructions: true,
			defaultPaymentLink: true,
			externalLinkInstructions: true,
			cashAtEntranceInstructions: true,
			freeInstructions: true,
		},
	});

	if (!org) notFound();

	return (
		<OrganizationProvider organization={org}>
			<div className="organization-data-layout flex flex-col gap-5">
				<HeaderWrapper>
					<div className="container max-w-4xl flex gap-20 justify-between items-center mx-auto sm:pt-10">
						<div className="main-data flex items-center gap-5">
							<OrganizationLogoUpload
								organizationId={org.id}
								organizationName={org.name}
								initialLogo={org.logo}
							/>
							<div>
								<span className="uppercase text-xs opacity-50 tracking-widest">
									Profil organizacji
								</span>
								<Typography variant="h1" className="w-max">
									{org.name}
								</Typography>
								<div className="flex items-center gap-2 mt-3 text-sm">
									<Badge
										variant="success"
										className="bg-green-800"
									>
										Zweryfikowano
									</Badge>
									<span className="opacity-50 w-max">
										{org.legalForm} · NIP {org.nip}
									</span>
								</div>
							</div>
						</div>
						<div className="stats p-4 bg-white/5 border border-white/5 backdrop-blur-xs rounded-md grid grid-cols-3 divide-x divide-white/5 w-full">
							<div className="stats-item flex gap-1 flex-col items-start pr-3">
								<span className="uppercase text-xs opacity-50">
									Wydarzenia
								</span>
								<p className="text-2xl font-semibold">
									12{" "}
									<span className="text-primary text-sm">
										+1
									</span>
								</p>
							</div>
							<div className="stats-item flex gap-1 flex-col items-start px-3">
								<span className="uppercase text-xs opacity-50">
									Uczestnicy
								</span>
								<p className="text-2xl font-semibold">1865</p>
							</div>
							<div className="stats-item flex gap-1 flex-col items-start pl-3">
								<div className="uppercase w-full flex justify-between text-xs ">
									<span className="opacity-50">PLan</span>
									<Link
										href={ORGANIZATION_PLAN_ROUTE(org.id)}
										className=" flex items-center gap-0.5 no-underline normal-case opacity-50 hover:opacity-100 hover:underline"
									>
										zmienic
										<IconArrowUpRight className="size-3" />
									</Link>
								</div>
								<p className="text-2xl font-semibold">Free</p>
							</div>
						</div>
					</div>
				</HeaderWrapper>

				<div className="container flex justify-center gap-4 max-w-5xl mx-auto">
					<aside className="relative">
						<OrganizationPageNavigation className="sticky top-0" />
					</aside>

					<div className="page-content flex flex-col w-full">
						{children}
					</div>
				</div>
			</div>
		</OrganizationProvider>
	);
};

export default OrganizationDataLayout;
