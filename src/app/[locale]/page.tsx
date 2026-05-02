import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BetaSignupForm } from "@/features/beta/components/beta-signup-form";
import { GridBg } from "@/features/layout";
import {
	IconArrowRight,
	IconChartBar,
	IconDeviceMobileMessage,
	IconLayout,
	IconMail,
	IconSquareRoundedCheckFilled,
	IconSquareRoundedXFilled,
	IconTicket,
	IconUsersGroup,
} from "@tabler/icons-react";

const HERO_BADGES = [
	"Pierwszeństwo dostępu",
	"Masz wpływ na rozwój produktu",
	"0% prowizji na zawsze",
];

const COMPETITORS_LIST = [
	"Konkurenci pobierają 5–8% wartości każdego biletu.",
	"Lista uczestników w Excelu, kody w mailu, raporty nigdzie.",
	"Check-in to kolejka i papierowa lista przy wejściu.",
	"Po evencie — zero danych o tym, kto i skad kupił.",
];

const ADVENTAGES_LIST = [
	"Sprzedaż biletów bez prowizji od pierwszego biletu",
	"Skaner QR i lista uczestników w czasie rzeczytywistym",
	"Marketing, mailing i współorganizatorzy w jednym panelu",
	"Pełne dane sprzedażowe i analityka po evencie",
];

const FEATURES = [
	{
		icon: <IconTicket className="size-6  " />,
		title: "Sprzedaż biletów bez prowizji",
		text: "Pełna kontrola nad cenami i typami biletów. Płatności BLIK, karta, Apple Pay — w jednym koszyku.",
	},
	{
		icon: <IconDeviceMobileMessage className="size-6  " />,
		title: "Check-in w 1 sekundę",
		text: "Skanowanie QR z telefonu lub tabletu. Bez kolejek, bez chaosu, bez papieru. Działa offline.",
	},
	{
		icon: <IconChartBar className="size-6  " />,
		title: "Dane, które naprawdę pomagają",
		text: "Sprzedaż w czasie rzeczywistym, źródła ruchu, kupujący. Wiesz, co działa — i powtarzasz to na kolejnym evencie.",
	},
	{
		icon: <IconUsersGroup className="size-6  " />,
		title: "Zespół i współorganizatorzy",
		text: "Dodaj kasjerów, hostessy, partnerów. Każdy widzi tylko to, co powinien.",
	},
	{
		icon: <IconMail className="size-6  " />,
		title: "Komunikacja z uczestnikami",
		text: "Automatyczne maile, przypomnienia, powiadomienia o zmianach — gotowe szablony pod Twój brand.",
	},
	{
		icon: <IconLayout className="size-6  " />,
		title: "Strona wydarzenia w 5 minut",
		text: "Edytor bez kodu, własna domena, gotowe do udostępnienia w social media.",
	},
];

const BETA_PERKS = [
	{
		num: "01",
		title: "Pierwszeństwo dostępu",
		text: "Gdy beta ruszy tego lata, dostajesz dostęp do platformy w pierwszej fali — zanim trafi do szerszego grona organizatorów.",
	},
	{
		num: "02",
		title: "Wpływ na rozwój platformy",
		text: "W becie dodajemy nowe funkcje co tydzień. Twoje uwagi i prośby trafiają wprost do roadmapy — to ty decydujesz, co powstanie najpierw.",
	},
	{
		num: "03",
		title: "Założycielskie warunki na zawsze",
		text: "Beta-testerzy zachowują specjalne warunki cenowe i status partnera-założyciela również po premierze pełnej wersji.",
	},
];

const ROADMAP = [
	{
		status: "ready",
		label: "Instrukcje płatności lub przy wejściu",
	},
	{ status: "ready", label: "Check-in QR i lista uczestników" },
	{ status: "ready", label: "Strona wydarzenia i edytor" },
	{ status: "ready", label: "Mailing i automatyzacje" },

	{ status: "ready", label: "Zarządzanie typami i limitami biletów" },
	{ status: "ready", label: "Panel organizatora w czasie rzeczywistym" },
	{ status: "ready", label: "Eksport listy uczestników (CSV/Excel)" },

	{ status: "soon", label: "Online wydarzenia" },
	{
		status: "soon",
		label: "Sprzedaż biletów online (BLIK, karta, Apple Pay)",
	},
	{ status: "soon", label: "Zaawansowana analityka" },
	{ status: "soon", label: "Współorganizatorzy i podział ról" },
	{ status: "soon", label: "Kody rabatowe i promocje" },
	{ status: "soon", label: "Własna domena wydarzenia" },
	{ status: "soon", label: "Integracja z mediami społecznościowymi" },
	{ status: "planned", label: "Aplikacja mobilna dla zespołu" },
	{ status: "planned", label: "Integracja z Google Calendar" },
	{ status: "planned", label: "API dla deweloperów" },
	{ status: "planned", label: "Program lojalnościowy dla uczestników" },
];

export default async function BetaPage() {
	const cookieStore = await cookies();
	const bypassToken = cookieStore.get("bypass_token")?.value;
	if (bypassToken && bypassToken === process.env.BYPASS_TOKEN) {
		redirect("/pl/events");
	}

	return (
		<main className="coming-soon-page relative flex flex-col gap-14 sm:gap-20 py-6">
			<GridBg />
			{/* 1. HERO */}
			<section className="flex flex-col items-center text-center z-10">
				<img
					src="/logos/logo_white.svg"
					alt="StworzEvent.pl"
					height={52}
					width={230}
					className="object-contain mb-10"
				/>
				<div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs md:text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-primary/20">
					<span className="relative flex h-2 w-2">
						<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
						<span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
					</span>
					Beta startuje latem · zapisy otwarte
				</div>
				<h1 className="text-4xl md:text-6xl lg:text-7xl text-gray-400 font-medium tracking-tight max-w-4xl mb-6 leading-tight">
					Bądź częścią
					<br />
					<span className="text-black font-bold">
						nowej platformy.
					</span>
				</h1>
				<p className="text-gray-500 text-base md:text-xl max-w-2xl leading-relaxed">
					StworzEvent to polska platforma{" "}
					<span className="font-medium text-black">
						dla organizatorów wydarzeń.
					</span>
				</p>
				<p className="text-gray-500 text-base md:text-xl max-w-2xl mt-4 mb-10 leading-relaxed">
					<span className="font-medium text-black">
						Beta rusza tego lata
					</span>{" "}
					— zbieramy organizatorów, którzy chcą być pierwsi i mieć
					realny wpływ na to, jak będzie się rozwijać.
				</p>
				<div className="flex flex-col sm:flex-row items-center gap-2">
					<Button className="p-5 px-4 rounded-xl" asChild>
						<a href="#beta">
							Zapisz się na betę <IconArrowRight />
						</a>
					</Button>
					<Button
						variant="outline"
						className="p-5 px-4 rounded-xl"
						asChild
					>
						<a href="#dlaczego">Co budujemy?</a>
					</Button>
				</div>
				<div className="mt-12 flex flex-wrap justify-center text-sm">
					{HERO_BADGES.map((badge, index) => (
						<span
							key={index}
							className="flex items-center gap-1 p-2 px-3"
						>
							<IconSquareRoundedCheckFilled className="size-5 text-green-600" />
							{badge}
						</span>
					))}
				</div>
			</section>

			{/* 2. PAIN → PROMISE */}
			<section className="max-w-5xl mx-auto w-full z-10">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
					<div className="px-4 sm:p-0">
						<p className="text-primary font-semibold text-sm uppercase tracking-wider mb-4">
							Znasz to?
						</p>
						<h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
							5 narzędzi, 3 arkusze i jeden zestresowany
							organizator.
						</h2>
						<ul className="space-y-3 text-gray-600 text-base md:text-lg">
							{COMPETITORS_LIST.map((item, index) => (
								<li
									key={index}
									className="flex gap-2 items-start"
								>
									<IconSquareRoundedXFilled className="size-6 text-red-500 mt-0.5" />
									{item}
								</li>
							))}
						</ul>
					</div>
					<div className="bg-linear-to-br from-[#f97315] to-[#ff9239] rounded-3xl p-8 md:p-10 text-white shadow-2xl shadow-[#f97315]/50">
						<p className="text-white/80 font-medium text-sm uppercase tracking-wider mb-4">
							StworzEvent
						</p>
						<h3 className="text-2xl md:text-3xl font-bold mb-6 leading-tight">
							Wszystko w jednym miejscu — od pomysłu do raportu po
							evencie.
						</h3>
						<ul className="space-y-3 text-white/95 text-base md:text-lg">
							{ADVENTAGES_LIST.map((item, index) => (
								<li
									key={index}
									className="flex gap-2 items-start"
								>
									<IconSquareRoundedCheckFilled className="size-7 mt-0.5" />
									{item}
								</li>
							))}
						</ul>
						<p className="mt-6 text-sm italic">
							*To kierunek, w którym idziemy. <br />
							<br />
							Część funkcji wejdzie na start bety, reszta
							powstanie na bieżąco — z udziałem beta-testerów.
						</p>
					</div>
				</div>
			</section>

			{/* 3. FEATURES */}
			<section id="dlaczego" className="max-w-6xl mx-auto w-full z-10">
				<div className="text-center mb-12 md:mb-16">
					<p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
						Wizja platformy
					</p>
					<h2 className="text-3xl md:text-5xl font-bold leading-tight max-w-3xl mx-auto">
						To budujemy — krok po kroku,
						<br className="hidden md:block" /> z naszą
						społecznością.
					</h2>
					<p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto mt-4">
						Część funkcji wejdzie do bety na start, pozostałe
						powstają na bieżąco — i to Ty współdecydujesz, co trafia
						na pierwsze miejsce.
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{FEATURES.map((f) => (
						<div
							key={f.title}
							className="group bg-white border border-black/5 rounded-2xl p-6 hover:border-black/10 hover:shadow-2xl hover:shadow-black/10 transition-all hover:-translate-y-1"
						>
							<div className="icon-wrapper mb-3 text-white bg-primary size-10 flex items-center justify-center rounded-full">
								{f.icon}
							</div>

							<h3 className="text-lg font-bold mb-2 leading-snug">
								{f.title}
							</h3>
							<p className="text-gray-600 text-sm leading-relaxed">
								{f.text}
							</p>
						</div>
					))}
				</div>

				{/* roadmap status */}
				<div className="mt-12 md:mt-16 bg-white border border-black/5 rounded-2xl p-6 md:p-8">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
						<div>
							<p className="text-primary font-semibold text-xs uppercase tracking-wider mb-1">
								Status produktu
							</p>
							<h3 className="text-xl md:text-2xl font-bold">
								Co wejdzie na start bety, co dorzucamy później
							</h3>
						</div>
						<div className="flex gap-3 text-xs text-gray-500 flex-wrap">
							<span className="flex items-center gap-1.5">
								<span className="w-2 h-2 rounded-full bg-green-500" />{" "}
								Na start bety
							</span>
							<span className="flex items-center gap-1.5">
								<span className="w-2 h-2 rounded-full bg-orange-500" />{" "}
								Tuż po starcie
							</span>
							<span className="flex items-center gap-1.5">
								<span className="w-2 h-2 rounded-full bg-gray-300" />{" "}
								Planowane
							</span>
						</div>
					</div>
					<ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
						{ROADMAP.map((r) => {
							const dot =
								r.status === "ready"
									? "bg-green-500"
									: r.status === "soon"
										? "bg-orange-500"
										: "bg-gray-300";
							const tone =
								r.status === "planned"
									? "text-gray-400"
									: "text-gray-700";
							return (
								<li
									key={r.label}
									className={`flex items-center gap-2 text-sm md:text-base ${tone}`}
								>
									<span
										className={`w-2.5 h-2.5 rounded-full ${dot} shrink-0`}
									/>
									<span
										dangerouslySetInnerHTML={{
											__html: r.label,
										}}
									/>
								</li>
							);
						})}
					</ul>
				</div>
			</section>

			{/* 4. BETA PERKS */}
			<section className="max-w-5xl mx-auto w-full z-10">
				<div className="bg-black rounded-3xl p-8 md:p-14 text-white relative overflow-hidden">
					<div className="absolute -top-20 -right-10 w-72 h-72 bg-primary/70 rounded-full blur-[140px]" />
					<div className="absolute -bottom-30 -left-10 w-96 h-96 bg-white/20 rounded-full blur-[140px]" />
					<div className="relative">
						<p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
							Stań się częścią rozwoju
						</p>
						<h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight max-w-2xl">
							Beta rusza tego lata. <br />
							Twoje miejsce — rezerwujesz już teraz.
						</h2>
						<p className="text-gray-400 text-base md:text-lg mb-12 max-w-2xl">
							Dokładnej daty jeszcze nie podajemy — chcemy ruszyć
							dopiero, gdy platforma będzie naprawdę gotowa.
							Zapisani jako pierwsi dostają dostęp, decydują, co
							powstaje później, i zatrzymują założycielskie
							warunki na zawsze.
						</p>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
							{BETA_PERKS.map((p) => (
								<div
									key={p.num}
									className="border-t border-white/10 pt-6"
								>
									<div className="text-primary font-mono text-sm mb-3">
										{p.num}
									</div>
									<h3 className="text-xl font-bold mb-2 leading-snug">
										{p.title}
									</h3>
									<p className="text-gray-400 text-sm leading-relaxed">
										{p.text}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* 5. FINAL CTA + FORM */}
			<section
				id="beta"
				className="max-w-xl mx-auto w-full scroll-mt-12 z-10"
			>
				<div className="relative bg-linear-to-br from-black to-black/90 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
					<GridBg className="opacity-10" />
					<div className="text-center mb-8">
						<div className="inline-block bg-primary/15 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-5 border border-primary/20">
							Zapisy na betę · start latem
						</div>
						<h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
							Bądź wśród pierwszych organizatorów
						</h2>
						<p className="text-gray-400 text-base">
							Zostaw kontakt — odezwiemy się z dostępem, gdy tylko
							ruszamy. Bez spamu, bez zobowiązań.
						</p>
					</div>
					<BetaSignupForm />
				</div>

				<footer className="mt-16 text-center text-sm text-gray-500">
					© {new Date().getFullYear()} StworzEvent.pl — Polska
					platforma dla organizatorów wydarzeń
				</footer>
			</section>
		</main>
	);
}
