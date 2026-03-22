import React from "react";
import ResetPasswordForm from "@/features/auth/components/forms/reset-password-form";
import ReturnBtn from "@/features/routing/components/return-btn";
import { SIGNIN_ROUTE } from "@/consts/routes";

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
