import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import React from "react";
import SignOutBtn from "#/components/sign-out-btn";
import { Link, redirect } from "@/i18n/routing";
import {
	ADMIN_DASHBOARD_ROUTE,
	HOME_ROUTE,
	SIGNIN_ROUTE,
} from "@/helpers/routes";
import { Button } from "@/shadcn/ui/button";
import BtnEmail from "#/components/btn-email";
import { Header } from "#/components/header/header";
import UpdateUserForm from "../components/forms/update-user-form";

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
			<div className="flex gap-3">
				<div className="image">
					{session?.user.image ? (
						<img
							src={session?.user.image}
							alt="User image"
							className="size-[80px] bg-muted-foreground rounded-full object-cover"
						/>
					) : (
						<div className="size-[80px] bg-muted-foreground rounded-full text-white flex justify-center items-center text-lg font-bold">
							{session?.user.name.slice(0, 2)}
						</div>
					)}
				</div>
				<div className="email flex flex-col gap-2">
					{session?.user.emailVerified ? (
						<p className="text-green-600">Email is verified!</p>
					) : (
						<p className="text-destructive">
							Email do not verified...
						</p>
					)}
					{!session?.user.emailVerified && <BtnEmail />}
				</div>
			</div>
			<hr />
			<div className="flex flex-col gap-3">
				<Header as={"h3"}>Update user</Header>
				<UpdateUserForm
					name={session?.user.name}
					image={session?.user.image}
				/>
			</div>

			<hr />

			<pre className="text-xs">{JSON.stringify(session, null, 2)}</pre>
		</div>
	);
}
