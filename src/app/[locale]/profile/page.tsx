import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import React from "react";
import SignOutBtn from "../components/sign-out-btn";
import { Link, redirect } from "@/i18n/routing";
import { HOME_ROUTE, SIGNIN_ROUTE } from "@/helpers/routes";

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
		<div>
			<Link href={HOME_ROUTE}>Go home</Link>
			<pre className="text-sm">{JSON.stringify(session, null, 2)}</pre>
			<SignOutBtn />
		</div>
	);
}
