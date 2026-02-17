"use client";

import { Button } from "@/shadcn/ui/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/shadcn/ui/input-group";
import { IconMail, IconTrash } from "@tabler/icons-react";
import React, { useState } from "react";
import { sendEmailAction } from "@/actions/send-email.action";
import { TypeMail } from "@/types/enums";
import { listOrganizers } from "@/mocks";
import { getBaseUrl } from "@/lib/utils";
import { SIGNUP_SPECIAL_ROUTE } from "@/helpers/routes";

type Mail = {
	value: string;
	id: Date | string;
};

export type Organizer = {
	name: string;
	email: Mail;
};

const AdminDashboard = () => {
	const [organizers, setOrganizers] = useState<Organizer[]>(listOrganizers);

	const baseUrl = getBaseUrl();
	const setupUrl = new URL(`${baseUrl}${SIGNUP_SPECIAL_ROUTE}`);

	const sendMails = async () => {
		for (const organizer of organizers) {
			//setupUrl.searchParams.append("token", organizer.inviteToken); TODO token from DB
			await await sendEmailAction({
				type: TypeMail.INVITATION,
				to: organizer.email.value,
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
					link: `${process.env.NEXT_PUBLIC_API_URL}?name${organizer.name}`,
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
						{/* <ol>
							{mails &&
								mails.map((mail) => (
									<li
										className="flex gap-2 items-center"
										key={String(mail.id)}
									>
										{mail.value}
										<Button
											size={"icon-sm"}
											variant={"destructive"}
											onClick={() =>
												setMails(
													mails.filter(
														(item) =>
															mail.id !== item.id,
													),
												)
											}
										>
											<IconTrash />
										</Button>
									</li>
								))}
						</ol> */}
					</main>
				</section>
			</div>
			{/* <SignInForm /> */}
		</section>
	);
};

export default AdminDashboard;
