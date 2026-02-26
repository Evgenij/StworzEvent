import { ADMIN_DASHBOARD_ROUTE, HOME_ROUTE } from "@/helpers/routes";
import { Link } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { Button } from "@/shadcn/ui/button";
import { headers } from "next/headers";
import React from "react";
import SignOutBtn from "../../components/sign-out-btn";
import EventsList from "../../components/events/events-list";
import { Typography } from "../../components/typography/typography";
import { Blockquote } from "../../components/typography/blockquote";
import { getTranslations } from "next-intl/server";

const DashboardPage = async ({ params }: { params: { locale: string } }) => {
	const session = await auth.api.getSession({ headers: await headers() });
	const t = await getTranslations("Profile.Dashboard");

	return (
		<div className="flex justify-start flex-col gap-4">
			<Typography className="text-left" variant="h1">
				{t("header")} {session?.user.name}
			</Typography>
			<Typography className="text-left" variant="h2">
				gdsfdf
			</Typography>
			<Typography className="text-left" variant="h3">
				gdsfdf
			</Typography>
			<Typography className="text-left" variant="h4">
				gdsfdf
			</Typography>

			<header className="flex gap-3">
				<Link href={HOME_ROUTE}>
					<Button variant={"outline"}>Home</Button>
				</Link>

				{session?.user.role === "ADMIN" && (
					<Link href={ADMIN_DASHBOARD_ROUTE}>
						<Button variant={"outline"}>Admin dashboard</Button>
					</Link>
				)}

				<SignOutBtn />
			</header>
			<hr />
			<div className="flex gap-3">
				<div className="image">
					{session?.user.image ? (
						<img
							src={session?.user.image}
							alt="User image"
							className="size-20 bg-muted-foreground rounded-full object-cover"
						/>
					) : (
						<div className="size-20 bg-muted-foreground rounded-full text-white flex justify-center items-center text-lg font-bold">
							{session?.user.name.slice(0, 2)}
						</div>
					)}
				</div>
				<div className="email flex flex-col gap-2">
					{session?.user.emailVerified ? (
						<p className="text-green-600">Email is verified!</p>
					) : (
						<p className="text-destructive">
							Email do not verified...
						</p>
					)}
					{/* {!session?.user.emailVerified && <BtnEmail />} */}
				</div>
			</div>
			<hr />
			{/* <div className="flex flex-col gap-3">
				<Header as={"h3"}>Update user</Header>
				<UpdateUserForm
					name={session?.user.name}
					image={session?.user.image}
				/>
			</div> */}

			{/* <pre className="text-xs w-full">
				{JSON.stringify(session, null, 2)}
			</pre> */}
		</div>
	);
};

export default DashboardPage;
