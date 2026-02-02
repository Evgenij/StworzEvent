"use client";

import { sendEmailAction } from "@/actions/send-email.action";
import { Button } from "@/shadcn/ui/button";
import React from "react";

function BtnEmail() {
	const sendEmail = async () => {
		await sendEmailAction({
			to: "evgeniu.ermolenko@gmail.com",
			subject: "Test email",
			meta: {
				link: "google.com",
				description: "Test email from StworzEvent",
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
