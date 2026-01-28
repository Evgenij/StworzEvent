"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
// import useMainRouter from "../useMainRouter";
import { useRouter } from "@/i18n/routing";
import {SIGNIN_ROUTE} from "@/helpers/routes";

export default function SignOutBtn() {
	const router = useRouter();

	async function handleSignOut() {
		await signOut({
			fetchOptions: {
				onError: (ctx) => {
					console.log(ctx.error.message);
				},
				//TODO add locale path from useMainRouter
				onSuccess: () => {

					router.push(SIGNIN_ROUTE);
				},
			},
		});
	}

	return (
		<Button variant={"destructive"} onClick={handleSignOut}>
			Sign out
		</Button>
	);
}
