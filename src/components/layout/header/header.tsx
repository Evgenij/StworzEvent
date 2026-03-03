import React from "react";
import NavLinks from "./nav-links";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/shadcn/ui/button";
import { IconLogin, IconUser, IconUserPlus } from "@tabler/icons-react";

type HeaderWebsiteProps = {
	locale: string;
};

const HeaderWebsite = ({ locale }: HeaderWebsiteProps) => {
	return (
		<header className="border-b">
			<div className="container mx-auto px-5 h-16 flex items-center justify-between">
				<Link href="/" locale={locale}>
					<span className="font-bold text-xl">StworzEvent.pl</span>
				</Link>

				<NavLinks />

				<div className="flex items-center gap-2">
					<Button variant="outline">
						<IconLogin /> Zaloguj się
					</Button>
					<Button>
						<IconUserPlus /> Zarejestruj się
					</Button>

					{/* UserMenu / Auth кнопки */}
				</div>
			</div>
		</header>
	);
};

export default HeaderWebsite;
