import { signOut } from "@/lib/auth-client";

export async function signOutAction(onSuccess: () => void) {
	await signOut({
		fetchOptions: {
			onError: (ctx) => {
				console.log(ctx.error.message);
			},
			onSuccess,
		},
	});
}
