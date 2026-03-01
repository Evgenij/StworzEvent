import SignInForm from "@/features/auth/components/forms/sign-in-form";
import MagicLinkForm from "@/features/auth/components/forms/magic-link-form";
import { useTranslations } from "next-intl";

export default function Page() {
	return <SignInForm />;
}
