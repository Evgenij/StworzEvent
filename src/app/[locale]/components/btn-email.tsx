"use client";

import { sendEmailAction } from "@/actions/send-email.action";
import { Button } from "@/shadcn/ui/button";
import React from "react";

function BtnEmail() {
	const sendEmail = async () => {
		await sendEmailAction({
			to: "evgeniu.ermolenko@gmail.com",
			subject: "Potwierdź adres e-mail",
			user: { name: "Name" },
			meta: {
				link: "google.com",
				icon: "https://stworzevent.vercel.app/images/mails/img-mail.png",
				header: "Potwierdź adres e-mail",
				description: `Dziękujemy za rejestrację na stronie StworzEvent.pl! <br />
							Prosimy o potwierdzenie adresu e-mail, klikając w
							poniższy link.`,
			},
		});
	};

	return (
		<Button onClick={sendEmail} variant={"outline"} className="w-fit">
			Send email
		</Button>
	);
}

export default BtnEmail;
