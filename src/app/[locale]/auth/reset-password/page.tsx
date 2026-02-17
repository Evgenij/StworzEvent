import React from "react";
import { Header } from "#/components/header/header";
import ResetPasswordForm from "#/components/forms/auth/reset-password-form";
import ReturnBtn from "#/components/return-btn";
import { SIGNIN_ROUTE } from "@/helpers/routes";

type PageProps = {
	searchParams: Promise<{ token: string }>;
};

const ResetPasswordPage = async ({ searchParams }: PageProps) => {
	const token = (await searchParams).token;

	if (!token) {
		return (
			<div>
				<div>Invalid token</div>{" "}
				<ReturnBtn href={SIGNIN_ROUTE} label="back" />
			</div>
		);
	}

	return <ResetPasswordForm token={token} />;
};

export default ResetPasswordPage;
