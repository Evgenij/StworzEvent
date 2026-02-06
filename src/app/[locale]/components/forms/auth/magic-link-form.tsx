"use client";

import { PROFILE_ROUTE } from "@/helpers/routes";
import { signIn } from "@/lib/auth-client";
import { email } from "better-auth";
import React, { useRef } from "react";
import { toast } from "sonner";

const MagicLinkForm = () => {
	const ref = useRef<HTMLDetailsElement>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const formData = new FormData(e.target as HTMLFormElement);
		const email = String(formData.get("email"));

		if (email) {
			await signIn.magicLink({
				email: email,
				name: email.split("@")[0],
				callbackURL: PROFILE_ROUTE,
				fetchOptions: {
					onError(error) {
						toast.success(error.error.message);
					},
					onSuccess: () => {
						toast.success("Email is sent");
						if (ref.current) ref.current.open = false;
					},
				},
			});
		}
	};

	return (
		<details ref={ref}>
			<summary>magic link</summary>
			<form action="" onSubmit={handleSubmit}>
				<input name="email" type="email" placeholder="email" />
				<button type="submit">send magic link</button>
			</form>
		</details>
	);
};

export default MagicLinkForm;
