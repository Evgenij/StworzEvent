import { User } from "@prisma/client";

export type UserType = {
	email: string;
	name?: string | null;
	image?: string | null;
};
