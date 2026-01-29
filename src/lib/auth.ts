import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import prisma from "@/lib/prisma";

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
	trustedOrigins: ["http://localhost:3001"],
});
