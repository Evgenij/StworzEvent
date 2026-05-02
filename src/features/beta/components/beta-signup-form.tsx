"use client";

import { useState } from "react";
import {
	betaSignupAction,
	BetaSignupInput,
} from "@/features/beta/actions/beta-signup.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldLabel } from "@/components/ui/field";
import { IconCircleCheckFilled } from "@tabler/icons-react";

export function BetaSignupForm() {
	const [form, setForm] = useState<BetaSignupInput>({
		email: "",
		name: "",
		surname: "",
		company: "",
	});
	const [status, setStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");
	const [errorMsg, setErrorMsg] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus("loading");
		setErrorMsg("");

		const result = await betaSignupAction(form);

		if (result.success) {
			setStatus("success");
		} else {
			setStatus("error");
			setErrorMsg(result.error);
		}
	};

	if (status === "success") {
		return (
			<div className="flex flex-col items-center justify-center text-center py-8 z-10">
				<IconCircleCheckFilled className="size-12 text-green-500 mb-5" />
				<h3 className="text-xl font-bold text-white mb-2">
					Dziękujemy za rejestrację!
				</h3>
				<p className="text-gray-400">
					Damy Ci znać, gdy platforma będzie gotowa.
				</p>
			</div>
		);
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col space-y-4 z-10 relative items-center"
		>
			<div className="grid grid-cols-1 sm:grid-cols-2  gap-4 w-full">
				<div className="space-y-1">
					<FieldLabel
						htmlFor="name"
						className="text-gray-300 text-sm"
					>
						Imię
					</FieldLabel>
					<Input
						id="name"
						value={form.name}
						onChange={(e) =>
							setForm({ ...form, name: e.target.value })
						}
						placeholder="Jan"
						required
						className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-[#e86405]"
					/>
				</div>
				<div className="space-y-1">
					<FieldLabel
						htmlFor="surname"
						className="text-gray-300 text-sm"
					>
						Nazwisko
					</FieldLabel>
					<Input
						id="surname"
						value={form.surname}
						onChange={(e) =>
							setForm({ ...form, surname: e.target.value })
						}
						placeholder="Kowalski"
						required
						className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-[#e86405]"
					/>
				</div>
			</div>

			<div className="space-y-1 w-full">
				<FieldLabel htmlFor="email" className="text-gray-300 text-sm">
					Email
				</FieldLabel>
				<Input
					id="email"
					type="email"
					value={form.email}
					onChange={(e) =>
						setForm({ ...form, email: e.target.value })
					}
					placeholder="jan@firma.pl"
					required
					className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-[#e86405]"
				/>
			</div>

			<div className="space-y-1  w-full">
				<FieldLabel htmlFor="company" className="text-gray-300 text-sm">
					Firma{" "}
					<span className="text-gray-500 font-normal">
						(opcjonalnie)
					</span>
				</FieldLabel>
				<Input
					id="company"
					value={form.company}
					onChange={(e) =>
						setForm({ ...form, company: e.target.value })
					}
					placeholder="Nazwa firmy lub organizacji"
					className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-[#e86405]"
				/>
			</div>

			{status === "error" && (
				<p className="text-red-400 text-sm">{errorMsg}</p>
			)}

			<Button
				type="submit"
				disabled={status === "loading"}
				size="lg"
				className="w-full sm:w-fit mt-4"
			>
				{status === "loading"
					? "Wysyłanie..."
					: "Zapisz się do beta-testu"}
			</Button>

			<p className="text-sm text-gray-500 text-center">
				* Nie wysyłamy spamu. Odezwiemy się tylko gdy platforma będzie
				gotowa
			</p>
		</form>
	);
}
