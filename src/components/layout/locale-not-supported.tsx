"use client";

import { usePathname, useRouter } from "@/i18n/routing";

const LocaleNotSupported = () => {
	const router = useRouter();
	const pathname = usePathname();

	const handleSwitch = () => {
		router.replace(pathname, { locale: "pl" });
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center bg-background">
			<div className="flex flex-col items-center gap-4 max-w-md">
				<span className="text-5xl">🇵🇱</span>
				<h1 className="text-2xl font-semibold tracking-tight">
					Polish only for now
				</h1>
				<p className="text-muted-foreground">
					StworzEvent.pl is currently available only in Polish. We're
					working on English support — stay tuned!
				</p>
				<button
					onClick={handleSwitch}
					className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
				>
					Przejdź do polskiej wersji →
				</button>
			</div>
		</div>
	);
};

export default LocaleNotSupported;
