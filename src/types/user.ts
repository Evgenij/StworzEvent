import { UserRole } from "@prisma/client";

export type UserType = {
	email: string;
	role: UserRole;
	name?: string | null;
	image?: string | null;
};
