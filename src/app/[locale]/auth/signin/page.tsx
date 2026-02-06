import SignInForm from "#/components/forms/auth/sign-in-form";
import MagicLinkForm from "#/components/forms/auth/magic-link-form";

export default function Page() {
	return (
		<section className="max-w-[350px] w-full flex flex-col gap-5">
			<MagicLinkForm />
			<hr />
			<SignInForm />
		</section>
	);
}
