"use client";

import { DASHBOARD_ROUTE, SIGNIN_ROUTE } from "@/config/routes";
import { Link } from "@/i18n/routing";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { IconLoader, IconRocket } from "@tabler/icons-react";
import React from "react";

function GetSessionBtn() {
	const { data: session, isPending } = useSession();

	const href = session ? DASHBOARD_ROUTE : SIGNIN_ROUTE;

	console.log(session);

	return (
		<div className="flex flex-col gap-4 items-center">
			{session && (
				<h2 className="text-2xl">
					<span
						data-role={session.user.role}
						className="text-xs p-2 py-1 text-white rounded-full animate-pulse data-[role=USER]:bg-blue-500 data-[role=ADMIN]:bg-zinc-900"
					>
						{session.user.role}
					</span>
					Welcome back, <strong>{session.user.name}</strong>
				</h2>
			)}
			<Link href={href}>
				<Button disabled={isPending}>
					{isPending && (
						<IconLoader className="animate-spin"></IconLoader>
					)}
					Get Started
					<IconRocket />
				</Button>
			</Link>
		</div>
	);
}

export default GetSessionBtn;
