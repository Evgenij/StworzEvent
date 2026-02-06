import React from "react";
import { Header } from "#/components/header/header";
import ResetPasswordForm from "#/components/forms/auth/reset-password-form";
import ReturnBtn from "#/components/return-btn";
import { SIGNIN_ROUTE } from "@/helpers/routes";

interface PageProps {
	searchParams: Promise<{ token: string }>;
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
		<div className="flex flex-col gap-6">
			<header className="flex flex-col gap-2">
				<Header as={"h2"}>Reset password</Header>{" "}
				<p className="text-muted-foreground">Enter your new password</p>
			</header>

			<ResetPasswordForm token={token} />
		</div>
	);
};

export default ResetPasswordPage;
