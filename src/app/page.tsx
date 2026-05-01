import { BetaSignupForm } from "@/features/beta/components/beta-signup-form";

export default function ComingSoonPage() {
	return (
		<main className="min-h-screen bg-[rgb(17,17,18)] flex flex-col items-center justify-center px-4 py-12">
			<div className="mb-12">
				<img
					src="/images/mails/logo_text_white.png"
					alt="StworzEvent.pl"
					height={32}
					width={220}
					className="object-contain"
				/>
			</div>

			<div className="text-center max-w-xl mb-10">
				<div className="inline-block bg-[#e86405]/20 text-[#e86405] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
					Już wkrótce
				</div>
				<h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
					Platforma dla organizatorów wydarzeń
				</h1>
				<p className="text-gray-400 text-lg leading-relaxed">
					Tworzymy narzędzie, które ułatwi Ci sprzedaż biletów, zarządzanie
					uczestnikami i organizację wydarzeń od A do Z.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl w-full mb-10">
				{[
					{ icon: "🎟️", text: "Sprzedaż biletów online" },
					{ icon: "✅", text: "Check-in przez QR kod" },
					{ icon: "📊", text: "Raporty i statystyki" },
				].map((item) => (
					<div
						key={item.text}
						className="bg-white/5 rounded-2xl px-5 py-4 text-center border border-white/10"
					>
						<div className="text-2xl mb-2">{item.icon}</div>
						<p className="text-gray-300 text-sm font-medium">{item.text}</p>
					</div>
				))}
			</div>

			<div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8">
				<h2 className="text-xl font-bold text-white mb-2">
					Dołącz do beta-testu
				</h2>
				<p className="text-gray-400 text-sm mb-6">
					Zapisz się i jako pierwszy przetestuj platformę przed premierą.
				</p>
				<BetaSignupForm />
			</div>

			<footer className="mt-12 text-gray-600 text-sm text-center">
				© {new Date().getFullYear()} StworzEvent.pl — Wszelkie prawa zastrzeżone
			</footer>
		</main>
	);
}
