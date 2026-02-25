import { User } from "@prisma/client";
import { axiosInstance } from "./axios";

type UserDataByToken = Pick<User, "name" | "email">;

export const getUserByInviteToken = async (
	token: string,
): Promise<UserDataByToken> => {
	return (await axiosInstance.get<UserDataByToken>("/users/token/" + token))
		.data;
};
