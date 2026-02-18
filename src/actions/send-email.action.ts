"use server";

import transporter from "@/lib/nodemailer";
import { ActionResult } from "@/types/action-result";
import { handleActionError, success } from "@/lib/action-utils";
import {
	authMail,
	AuthMailsProps,
	codeMail,
	CodeMailsProps,
	invitationMail,
	InvitationMailsProps,
} from "@/helpers/mail-templates";
import { TypeMail } from "@/types/enums";

type EmailData =
	| { type: TypeMail.INVITATION; data: InvitationMailsProps }
	| { type: TypeMail.AUTH; data: AuthMailsProps }
	| { type: TypeMail.CODE; data: CodeMailsProps };

export async function sendEmailAction({
	type,
	to,
	subject,
	data,
}: EmailData & { to: string; subject: string }): Promise<ActionResult> {
	let htmlContent = "";

	switch (type) {
		case TypeMail.INVITATION:
			htmlContent = invitationMail(data);
			break;
		case TypeMail.CODE:
			htmlContent = codeMail(data);
			break;
		case TypeMail.AUTH:
		default:
			htmlContent = authMail(data);
			break;
	}

	try {
		await transporter.sendMail({
			from: '"StworzEvent.pl" <no-reply@stworzevent.pl>',
			to,
			subject,
			html: htmlContent,
		});

		return success(null);
	} catch (error: any) {
		return handleActionError(error);
	}
}
