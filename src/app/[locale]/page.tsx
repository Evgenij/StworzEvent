import { Button } from "@/components/ui/button";
import { SIGNIN_ROUTE, SIGNUP_ROUTE, UI_ROUTE } from "@/helpers/routes";
import { Link } from "@/i18n/routing";

const links = [
	{
		label: "Sign In",
		href: SIGNIN_ROUTE,
	},
	{
		label: "Sign Up",
		href: SIGNUP_ROUTE,
	},
	{
		label: "UI",
		href: UI_ROUTE,
	},
];

export default function Page() {
	return (
		<div className="flex flex-col items-center justify-center gap-3 h-full">
			<h1 className="text-4xl font-bold">HOME</h1>
			<nav className="flex items-center justify-center gap-3">
				{links.map((link) => {
					return (
						<Link key={link.href} href={`pl/${link.href}`}>
							<Button variant={"outline"} key={link.href}>
								{link.label}
							</Button>
						</Link>
					);
				})}
			</nav>
		</div>
	);
}
