import React from "react";
import ForgetPasswordForm from "#/components/forms/auth/forget-password-form";
import { Header } from "#/components//header/header";

const ForgetPasswordPage = () => {
	return (
		<div className="flex flex-col items-center gap-6 max-w-[350px] w-full">
			<Header as={"h2"}>Reset hasla</Header>
			<ForgetPasswordForm />
		</div>
	);
};

export default ForgetPasswordPage;
