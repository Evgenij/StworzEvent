import React from "react";
import SignInForm from "#/components/forms/sign-in-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "@/i18n/routing";
import { SIGNIN_ROUTE } from "@/helpers/routes";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";
import { Button } from "@/shadcn/ui/button";
import { size } from "better-auth";
import DeleteUserBtn from "../../components/delete-user-btn";

async function AdminDashboard({ params }: { params: { locale: string } }) {
	// Ждем получения параметров (в Next.js 15 это Promise)
	const { locale } = await params;
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) redirect({ href: SIGNIN_ROUTE, locale });
	const { users } = await auth.api.listUsers({
		headers: await headers(),
		query: {
			sortBy: "role",
		},
	});

	return (
		<section className="h-full flex flex-col gap-8 p-8">
			<h1 className="text-4xl">Admin Dashboard</h1>
			{session?.user.role !== "ADMIN" ? (
				<p className="text-red-600">Access denied!</p>
			) : (
				<div className="flex flex-col gap-3">
					<h2 className="text-xl font-medium">
						Hello, {session.user.email}
					</h2>
					<ol>
						{users.map((user) => {
							return (
								<li key={user.id} className="py-1">
									{user.name}: {user.email}{" "}
									<DeleteUserBtn
										userId={user.id}
										role={user.role}
									/>
								</li>
							);
						})}
					</ol>
				</div>
			)}
			{/* <SignInForm /> */}
		</section>
	);
}

export default AdminDashboard;
