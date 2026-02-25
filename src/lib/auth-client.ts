import { createAuthClient } from "better-auth/react";
import {
	inferAdditionalFields,
	adminClient,
	customSessionClient,
	magicLinkClient,
} from "better-auth/client/plugins";
import { auth } from "@/lib/auth";
import { ac, roles } from "@/lib/permissions";

export const authClient = createAuthClient({
	/** The base URL of the server (optional if you're using the same domain) */
	// baseURL: process.env.NEXT_PUBLIC_VERCEL_URL
	// 	? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
	// 	: "http://localhost:3000",
	plugins: [
		inferAdditionalFields<typeof auth>(),
		adminClient({ ac, roles }),
		customSessionClient<typeof auth>(),
		magicLinkClient(),
	],
});

export const {
	signUp,
	signOut,
	signIn,
	useSession,
	sendVerificationEmail,
	resetPassword,
	updateUser,
} = authClient;
