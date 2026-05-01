"use client";

import { useState } from "react";
import {
	betaSignupAction,
	BetaSignupInput,
} from "@/features/beta/actions/beta-signup.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
			<div className="text-center py-8">
				<div className="text-4xl mb-4">✓</div>
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
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-1">
					<Label htmlFor="name" className="text-gray-300 text-sm">
						Imię <span className="text-[#e86405]">*</span>
					</Label>
					<Input
						id="name"
						value={form.name}
						onChange={(e) => setForm({ ...form, name: e.target.value })}
						placeholder="Jan"
						required
						className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-[#e86405]"
					/>
				</div>
				<div className="space-y-1">
					<Label htmlFor="surname" className="text-gray-300 text-sm">
						Nazwisko <span className="text-[#e86405]">*</span>
					</Label>
					<Input
						id="surname"
						value={form.surname}
						onChange={(e) => setForm({ ...form, surname: e.target.value })}
						placeholder="Kowalski"
						required
						className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-[#e86405]"
					/>
				</div>
			</div>

			<div className="space-y-1">
				<Label htmlFor="email" className="text-gray-300 text-sm">
					Email <span className="text-[#e86405]">*</span>
				</Label>
				<Input
					id="email"
					type="email"
					value={form.email}
					onChange={(e) => setForm({ ...form, email: e.target.value })}
					placeholder="jan@firma.pl"
					required
					className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-[#e86405]"
				/>
			</div>

			<div className="space-y-1">
				<Label htmlFor="company" className="text-gray-300 text-sm">
					Firma{" "}
					<span className="text-gray-500 font-normal">(opcjonalnie)</span>
				</Label>
				<Input
					id="company"
					value={form.company}
					onChange={(e) => setForm({ ...form, company: e.target.value })}
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
				className="w-full bg-[#e86405] hover:bg-[#fc8530] text-white font-semibold py-3 rounded-xl transition-colors"
			>
				{status === "loading" ? "Wysyłanie..." : "Zapisz się do beta-testu"}
			</Button>

			<p className="text-xs text-gray-500 text-center">
				Nie wysyłamy spamu. Odezwiemy się tylko gdy platforma będzie gotowa.
			</p>
		</form>
	);
}
