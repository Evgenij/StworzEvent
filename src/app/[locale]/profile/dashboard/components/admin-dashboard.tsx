"use client";

import { sendEmailAction } from "@/actions/send-email.action";
import { API_ROUTES } from "@/app/api/apiRoutes";
import { apiFetcher } from "@/app/api/fetcher";
import { Button } from "@/components/shadcn/ui/button";
import { PageHeader } from "@/features/layout";
import { SIGNUP_INVITE_ROUTE } from "@/helpers/routes";
import { ApiResponse } from "@/types/api-pesponse";
import { TypeMail } from "@/types/enums";
import { UserType } from "@/types/user";
import { Invitation } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export function AdminDashboard({ user }: { user: UserType }) {
	const {
		data: invites,
		error,
		isLoading,
		isFetching,
		refetch,
	} = useQuery<ApiResponse<Invitation[]>>({
		queryKey: ["invites"],
		queryFn: () => apiFetcher(API_ROUTES.invites),
	});

	const sendMails = async () => {
		if (!invites?.data) return;
		for (const invite of invites.data) {
			const inviteUrl = new URL(
				SIGNUP_INVITE_ROUTE,
				process.env.NEXT_PUBLIC_API_URL,
			);
			inviteUrl.searchParams.set("token", invite.token);

			console.log(inviteUrl.toString());

			await sendEmailAction({
				type: TypeMail.INVITATION,
				to: invite.email,
				subject:
					"Twoje zaproszenie do zamkniętej wersji beta StworzEvent.pl",
				data: {
					header: "Dzień dobry!",
					subheader:
						"Zostałeś wybrany jako jeden z pierwszych organizatorów testujących platformę.",
					ticket: {
						name: "StworzEvent.pl",
						header: {
							main: "Oficjalnie ruszamy z etapem zamkniętych testów beta StworzEvent.pl.",
							subheader:
								"Twoje konto jest już gotowe do działania.",
						},
						footer: "Pozostał ostatni krok — potwierdzenie konta i ustawienie hasła dostępu.",
						btnText: "Wejdź do platformy",
					},
					link: inviteUrl.toString(),
				},
			});
		}
	};

	return (
		<div className="flex flex-col gap-3">
			<PageHeader />
			<pre className="text-xs">{JSON.stringify(user, null, 2)}</pre>
			<hr />
			<div className="flex flex-col gap-3">
				<section className="flex flex-col gap-4">
					<header className="flex gap-3">
						<Button onClick={sendMails}>Send</Button>
					</header>
					<hr />
					<main className="flex flex-col gap-2">
						{isLoading && <p>Loading...</p>}
						{error && <p>Error: {error.message}</p>}
						<ol>
							{invites?.data &&
								invites.data.map((invite) => (
									<li
										className="flex gap-2 items-center"
										key={String(invite.id)}
									>
										{invite.name} {invite.surname}:
										{invite.email} -{" "}
										{invite.isAccepted
											? "Accepted"
											: "Not Accepted"}
									</li>
								))}
						</ol>
					</main>
				</section>
			</div>
			{/* users, orgs, moderation */}
		</div>
	);
}
