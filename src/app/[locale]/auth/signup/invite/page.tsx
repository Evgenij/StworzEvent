import SignUpInviteForm from "@/app/[locale]/components/forms/auth/sign-up-invite-form";

type PageProps = {
	searchParams: Promise<{ token: string }>;
};

const SignUpInvitePage = async ({ searchParams }: PageProps) => {
	const token = (await searchParams).token;

	if (!token) {
		return <div> Brak tokenu zaproszenia</div>; // TODO add message to action result
	}

	return <SignUpInviteForm token={token} />;
};

export default SignUpInvitePage;
