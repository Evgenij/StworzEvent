"use server";

import { hash, verify, type Options } from "@node-rs/argon2";

const options: Options = {
	memoryCost: 19456,
	timeCost: 2,
	parallelism: 1,
	outputLen: 32,
};

export const hashPassword = async (password: string) => {
	return await hash(password, options);
};

export const verifyPassword = async (data: {
	password: string;
	hash: string;
}) => {
	const { password, hash } = data;
	return await verify(hash, password, options);
};
