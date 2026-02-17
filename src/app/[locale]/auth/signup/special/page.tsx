import SignUpSpecForm from "#/components/forms/auth/sign-up-spec-form";
import React from "react";

type PageProps = {
	searchParams: Promise<{ email: string; name: string }>;
};

const SignUpSpecFormPage = async ({ searchParams }: PageProps) => {
	// Ждем, пока параметры «разрешатся»
	const { email, name } = await searchParams;
	return <SignUpSpecForm email={email} name={name} />;
};

export default SignUpSpecFormPage;
