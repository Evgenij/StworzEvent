import React from "react";
import ForgetPasswordForm from "#/components/forms/auth/forget-password-form";
import { Header } from "#/components//header/header";

const ForgetPasswordPage = () => {
	return (
		<div className="max-w-[350px] w-full flex flex-col gap-5">
			<ForgetPasswordForm />
		</div>
	);
};

export default ForgetPasswordPage;
