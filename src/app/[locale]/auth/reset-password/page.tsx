import React from "react";
import { Header } from "#/components/header/header";
import ResetPasswordForm from "#/components/forms/auth/reset-password-form";
import ReturnBtn from "#/components/return-btn";
import { SIGNIN_ROUTE } from "@/helpers/routes";

interface PageProps {
	searchParams: Promise<{ token: string; email: string }>;
}

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

	return (
		<div className="max-w-[350px] w-full flex flex-col gap-5">
			<ResetPasswordForm token={token} />
		</div>
	);
};

export default ResetPasswordPage;
