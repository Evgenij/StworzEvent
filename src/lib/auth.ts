import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware } from "better-auth/api";
import { normalizeName } from "./utils";
import { UserRole } from "@prisma/client";
import { admin } from "better-auth/plugins";
import { ac, roles } from "@/lib/permissions";
import { sendEmailAction } from "@/actions/send-email.action";
import { AUTH_VERIFY_ROUTE, PROFILE_ROUTE } from "@/helpers/routes";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
		facebook: {
			clientId: process.env.FACEBOOK_CLIENT_ID as string,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
		},
	},
	account: {
		accountLinking: {
			enabled: true,
		},
	},
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 6,
		autoSignIn: false, // optional
		//requireEmailVerification: true,
	},
	emailVerification: {
		sendOnSignUp: true,
		expiresIn: 60 * 60, // 1 hour
		// expiresIn: 5, // 5 seconds
		//enabled: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url }) => {
			const link = new URL(url);
			link.searchParams.set("callbackURL", PROFILE_ROUTE);

			// send email to user
			await sendEmailAction({
				to: user.email,
				subject: "Potwierdź adres e-mail",
				user: {
					name: user.name,
				},
				meta: {
					link: String(link),
					icon: "https://stworzevent.vercel.app/images/mails/img-mail.png",
					header: "Potwierdź adres e-mail",
					description: `Dziękujemy za rejestrację na stronie StworzEvent.pl! <br />
							Prosimy o potwierdzenie adresu e-mail, klikając w
							poniższy link.`,
				},
			});
		},
	},
	hooks: {
		before: createAuthMiddleware(async (ctx) => {
			if (ctx.path === "/sign-up/email") {
				const name = normalizeName(ctx.body?.name || "");
				//TODO show error sonner
				return {
					context: {
						...ctx,
						body: {
							...ctx.body,
							name,
						},
					},
				};
			}
		}),
	},

	// advanced: {
	// 	database: {
	// 		generateId: false, // disabling 3TTPkuoYfDzYkTdm8kX1N4UdOuCAHg9S id like this
	// 	},
	// },
	databaseHooks: {
		user: {
			create: {
				before: async (user) => {
					const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(";");
					console.log("USER EMAIL: ", user.email, ADMIN_EMAILS);
					if (ADMIN_EMAILS?.includes(user.email)) {
						return { data: { ...user, role: UserRole.ADMIN } };
					}

					return { data: user };
				},
			},
		},
	},
	user: {
		additionalFields: {
			role: {
				type: ["USER", "ADMIN"] as Array<UserRole>, // Better Auth должен знать, что в БД это строка
				required: false, // ЭТО УБЕРЕТ ОШИБКУ В Action
				defaultValue: "USER",
				input: false, // Это скроет поле из клиентских методов типа signUp
			},
		},
	},
	plugins: [
		nextCookies(),
		admin({
			defaultRole: UserRole.USER,
			adminRoles: [UserRole.ADMIN],
			ac,
			roles,
		}),
	],
	session: {
		expiresIn: 30 * 24 * 60 * 60, // 30 days
	},
	trustedOrigins: ["http://localhost:3001"],
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";
