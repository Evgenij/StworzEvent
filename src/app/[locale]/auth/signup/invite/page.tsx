import SignUpInviteForm from "@/features/auth/components/forms/sign-up-invite-form";
import { getTranslations } from "next-intl/server";

type PageProps = {
	searchParams: Promise<{ token: string }>;
};

const SignUpInvitePage = async ({ searchParams }: PageProps) => {
	const token = (await searchParams).token;
	const t = await getTranslations("SignUpInviteForm");

	if (!token) {
		return <div>{t("noToken")}</div>;
	}

	return <SignUpInviteForm token={token} />;
};

export default SignUpInvitePage;
