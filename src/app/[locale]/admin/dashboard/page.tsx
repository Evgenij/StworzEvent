"use client";

import { Button } from "@/shadcn/ui/button";
import React, { useEffect, useState } from "react";
import { sendEmailAction } from "@/actions/send-email.action";
import { TypeMail } from "@/types/enums";
import { SIGNUP_INVITE_ROUTE } from "@/helpers/routes";
import { Invitation } from "@prisma/client";
import { getInvitesAction } from "@/actions/invites/get-invites.action";
import useSWR from "swr";
import { getInvites } from "@/services/invites.service";
import { apiFetcher } from "@/app/api/fetcher";
import { API_ROUTES } from "@/app/api/apiRoutes";

type Mail = {
	value: string;
	id: Date | string;
};

export type Organizer = {
	name: string;
	email: Mail;
};

// ─── Типы для типизации SWR ──────────────────────────────────────────────────
interface FetchError extends Error {
	code?: string;
	details?: Record<string, string[]>;
}

const AdminDashboard = () => {
	//const [invites, setInvites] = useState<Invitation[]>([]);

	const {
		data: invites,
		error,
		isLoading,
	} = useSWR<Invitation[]>(API_ROUTES.invites, apiFetcher);

	const sendMails = async () => {
		if (!invites) return;
		for (const invite of invites) {
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
		<section className="h-full flex flex-col">
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
							{invites &&
								invites.map((invite) => (
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
			{/* <SignInForm /> */}
		</section>
	);
};

export default AdminDashboard;
