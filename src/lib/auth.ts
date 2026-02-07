import {
	betterAuth,
	BetterAuthOptions,
	FacebookProfile,
	GoogleProfile,
} from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware } from "better-auth/api";
import { normalizeName } from "./utils";
import { UserRole } from "@prisma/client";
import { admin, customSession, magicLink } from "better-auth/plugins";
import { ac, roles } from "@/lib/permissions";
import { sendEmailAction } from "@/actions/send-email.action";
import { AUTH_VERIFY_ROUTE, PROFILE_ROUTE } from "@/helpers/routes";

const options = {
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			mapProfileToUser: (profile: GoogleProfile) => {
				console.log("Google profile:", profile);
				return {
					name: profile.given_name,
					surname: profile.family_name, // Маппим фамилию из Google
					email: profile.email,
				};
			},
		},
		facebook: {
			clientId: process.env.FACEBOOK_CLIENT_ID as string,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
			mapProfileToUser: (profile: FacebookProfile) => {
				//const [firstName, ...lastNameParts] = profile.name.split(" ");
				//console.log("Facebook profile:", profile);
				return {
					name: profile.name.split(" ")[0],
					surname: profile.name.split(" ")[1], // Маппим фамилию из FB
					email: profile.email,
				};
			},
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
		sendResetPassword: async ({ user, url }) => {
			await sendEmailAction({
				to: user.email,
				subject: "Reset hasla",
				meta: {
					header: "Resetowanie hasła",
					subheader: `Hej, ${user.name}`,
					description:
						"Aby odzyskać hasło, kliknij przycisk poniżej.",
					icon: "https://stworzevent.vercel.app/images/mails/img-reset-password.png",
					link: url,
					btnText: "Zresetuj hasło",
				},
			});
		},
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
				meta: {
					header: "Potwierdź adres e-mail",
					subheader: `Witam, ${user.name}!`,
					description: `Dziękujemy za rejestrację na stronie StworzEvent.pl! <br />
							Prosimy o potwierdzenie adresu e-mail, klikając w
							poniższy link.`,
					icon: "https://stworzevent.vercel.app/images/mails/img-mail.png",
					link: String(link),
					btnText: "Potwierdź adres e-mail",
				},
			});
		},
	},
	hooks: {
		before: createAuthMiddleware(async (ctx) => {
			if (
				ctx.path === "/sign-up/email" ||
				"/api/auth/sign-in/magic-link" ||
				"/update-user"
			) {
				//TODO show error sonner
				return {
					context: {
						...ctx,
						body: {
							...ctx.body,
							name: normalizeName(ctx.body?.name || ""),
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
			surname: {
				type: "string",
				required: true, // или true, если это обязательно
			},
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
		magicLink({
			sendMagicLink: async ({ email, url }) => {
				await sendEmailAction({
					to: email,
					subject: "Magic link",
					meta: {
						header: "Magic link",
						subheader: `Hej!`,
						description: `Kliknij w poniższy link, aby się zalogować.`,
						icon: "https://stworzevent.vercel.app/images/mails/img-magic-link.png",
						link: url,
						btnText: "Zaloguj się",
					},
				});
			},
		}),
	],
	session: {
		expiresIn: 30 * 24 * 60 * 60, // 30 days
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60, // 5 minutes
		},
	},
	trustedOrigins: [
		process.env.BETTER_AUTH_URL as string, // Это подтянет https://stworzevent.vercel.app на продакшене
		"http://localhost:3000",
	],
} satisfies BetterAuthOptions;

export const auth = betterAuth({
	...options,
	plugins: [
		...(options.plugins || []),
		customSession(async ({ session, user }) => {
			return {
				...session,
				user: {
					...user,
					testMessage: "!!!",
					role: user.role,
				},
			};
		}, options),
	],
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";
