import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import React from "react";
import SignOutBtn from "../components/forms/sign-out-btn";

export default async function ProfilePage() {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) return <div>Not authenticated</div>;
	return (
		<div>
			<pre className="text-sm">{JSON.stringify(session, null, 2)}</pre>
			<SignOutBtn />
		</div>
	);
}
