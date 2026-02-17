"use client";

import { Button } from "@/shadcn/ui/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/shadcn/ui/input-group";
import { IconMail, IconTrash } from "@tabler/icons-react";
import React, { useState } from "react";
import { mails as orgMails } from "../../../../../organizatorsMails";
import { sendEmailAction } from "@/actions/send-email.action";
import { TypeMail } from "@/types/enums";

export type Mail = {
	value: string;
	id: Date | string;
};

const AdminDashboard = () => {
	const [newMail, setNewMail] = useState<Mail>({ value: "", id: new Date() });
	const [mails, setMails] = useState<Mail[]>(orgMails);

	const sendMails = async () => {
		mails.forEach(async (mail) => {
			await sendEmailAction({
				type: TypeMail.INVITATION,
				to: mail.value,
				subject: "Testing",
				data: {
					header: "",
					subheader: "",
					ticket: {
						name: "",
						header: {
							main: "",
							subheader: "",
						},
						footer: "",
						btnText: "",
					},
					link: "",
				},
			});
		});
	};

	return (
		<section className="h-full flex flex-col">
			<div className="flex flex-col gap-3">
				<section className="flex flex-col gap-4">
					<header className="flex gap-3">
						<InputGroup>
							<InputGroupAddon>
								<IconMail />
							</InputGroupAddon>
							<InputGroupInput
								name="mail"
								placeholder="mail"
								autoComplete="on"
								type="email"
								value={newMail.value}
								onChange={(e) =>
									setNewMail({
										value: e.target.value,
										id: new Date(),
									})
								}
							/>
						</InputGroup>
						<Button
							variant={"outline"}
							onClick={() => {
								setMails([...mails, newMail]);
							}}
						>
							Add mail
						</Button>
						<Button onClick={sendMails}>Send</Button>
					</header>
					<hr />
					<main className="flex flex-col gap-2">
						<ol>
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
						</ol>
					</main>
				</section>
			</div>
			{/* <SignInForm /> */}
		</section>
	);
};

export default AdminDashboard;
