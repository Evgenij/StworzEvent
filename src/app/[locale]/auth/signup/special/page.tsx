import { verifyInviteTokenAction } from "@/actions/auth/invite.action";
import SignUpSpecForm from "#/components/forms/auth/sign-up-spec-form";
import { notFound } from "next/navigation";

type PageProps = {
	searchParams: Promise<{ token: string }>;
};

const SignUpSpecFormPage = async ({ searchParams }: PageProps) => {
	const token = (await searchParams).token;

	if (!token) {
		return <div> Brak tokenu zaproszenia</div>;
	}

	const result = await verifyInviteTokenAction(token);

	if (!result.success) {
		notFound();
	}

	console.log(result.data);

	return <SignUpSpecForm user={result.data} />;
};

export default SignUpSpecFormPage;
