import { Button } from "@/shadcn/ui/button";
import {
	ADMIN_DASHBOARD_ROUTE,
	SIGNIN_ROUTE,
	SIGNUP_ROUTE,
	UI_ROUTE,
} from "@/helpers/routes";
import { Link, redirect } from "@/i18n/routing";
import GetSessionBtn from "./components/get-session-btn";

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
		label: "UI components",
		href: UI_ROUTE,
	},
	{
		label: "Admin Dashboard",
		href: ADMIN_DASHBOARD_ROUTE,
	},
];

export default async function Page({ params }: { params: { locale: string } }) {
	const { locale } = await params;
	redirect({ href: SIGNIN_ROUTE, locale: locale });
	return null;
	//return (
	// <div className="flex flex-col items-center justify-center gap-10 h-full">
	// 	<section>
	// 		<GetSessionBtn />
	// 	</section>
	// 	<nav className="flex items-center justify-center gap-3">
	// 		{links.map((link) => {
	// 			return (
	// 				<Link key={link.href} href={`pl/${link.href}`}>
	// 					<Button variant={"outline"} key={link.href}>
	// 						{link.label}
	// 					</Button>
	// 				</Link>
	// 			);
	// 		})}
	// 	</nav>
	// </div>
	//);
}
