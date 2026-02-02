import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import React from "react";
import SignOutBtn from "../components/sign-out-btn";
import { Link, redirect } from "@/i18n/routing";
import {
	ADMIN_DASHBOARD_ROUTE,
	HOME_ROUTE,
	SIGNIN_ROUTE,
} from "@/helpers/routes";
import { Button } from "@/shadcn/ui/button";
import { sendEmailAction } from "@/actions/send-email.action";
import BtnEmail from "../components/btn-email";

export default async function ProfilePage({
	params,
}: {
	params: { locale: string };
}) {
	// Ждем получения параметров (в Next.js 15 это Promise)
	const { locale } = await params;
	const session = await auth.api.getSession({ headers: await headers() });

	// hardcode - locale pl
	if (!session) redirect({ href: SIGNIN_ROUTE, locale });

	return (
		<div className="p-6 flex flex-col gap-4">
			<header className="flex gap-3">
				<Link href={HOME_ROUTE}>
					<Button variant={"outline"}>Home</Button>
				</Link>

				{session?.user.role === "ADMIN" && (
					<Link href={ADMIN_DASHBOARD_ROUTE}>
						<Button variant={"outline"}>Admin dashboard</Button>
					</Link>
				)}

				<SignOutBtn />
			</header>
			<hr />
			<BtnEmail />
			<hr />

			<pre className="text-sm">{JSON.stringify(session, null, 2)}</pre>
		</div>
	);
}
