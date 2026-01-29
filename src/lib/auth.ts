import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import prisma from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 6,
		autoSignIn: false, // optional
	},
	// advanced: {
	// 	database: {
	// 		generateId: false, // disabling 3TTPkuoYfDzYkTdm8kX1N4UdOuCAHg9S id like this
	// 	},
	// },
	plugins: [nextCookies()],
	session: {
		expiresIn: 30 * 24 * 60 * 60, // 30 days
	},
	trustedOrigins: ["http://localhost:3001"],
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";
