"use client";

import { PROFILE_ROUTE, SIGNIN_ROUTE } from "@/helpers/routes";
import { Link } from "@/i18n/routing";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/shadcn/ui/button";
import { IconLoader, IconRocket } from "@tabler/icons-react";
import React from "react";

function GetSessionBtn() {
	const { data: session, isPending } = useSession();

	const href = session ? PROFILE_ROUTE : SIGNIN_ROUTE;

	return (
		<div className="flex flex-col gap-4 items-center">
			{session && (
				<h2 className="text-2xl">
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
