import resend from "@/lib/resend";
import { APP_CONFIG } from "@/config/app";
import { TypeMail } from "@/types/enums";
import {
	authMail,
	AuthMailsProps,
	codeMail,
	CodeMailsProps,
	invitationMail,
	InvitationMailsProps,
	orderPaymentInstructionsMail,
	OrderPaymentInstructionsMailProps,
	organizerNewOrderMail,
	OrganizerNewOrderMailProps,
	orderTicketsMail,
	OrderTicketsMailProps,
	orderReminderMail,
	OrderReminderMailProps,
} from "@/helpers/mail-templates";

type EmailPayload =
	| { type: TypeMail.INVITATION; data: InvitationMailsProps }
	| { type: TypeMail.AUTH; data: AuthMailsProps }
	| { type: TypeMail.CODE; data: CodeMailsProps }
	| { type: TypeMail.ORDER_PAYMENT_INSTRUCTIONS; data: OrderPaymentInstructionsMailProps }
	| { type: TypeMail.ORDER_ORGANIZER_NOTIFY; data: OrganizerNewOrderMailProps }
	| { type: TypeMail.ORDER_TICKETS; data: OrderTicketsMailProps }
	| { type: TypeMail.ORDER_REMINDER; data: OrderReminderMailProps };

export type SendEmailInput = EmailPayload & {
	to: string;
	subject: string;
};

export async function sendEmail(input: SendEmailInput): Promise<void> {
	const { type, to, subject, data } = input;

	let htmlContent: string;

	switch (type) {
		case TypeMail.INVITATION:
			htmlContent = invitationMail(data);
			break;
		case TypeMail.CODE:
			htmlContent = codeMail(data);
			break;
		case TypeMail.AUTH:
			htmlContent = authMail(data);
			break;
		case TypeMail.ORDER_PAYMENT_INSTRUCTIONS:
			htmlContent = orderPaymentInstructionsMail(data);
			break;
		case TypeMail.ORDER_ORGANIZER_NOTIFY:
			htmlContent = organizerNewOrderMail(data);
			break;
		case TypeMail.ORDER_TICKETS:
			htmlContent = orderTicketsMail(data);
			break;
		case TypeMail.ORDER_REMINDER:
			htmlContent = orderReminderMail(data);
			break;
		default:
			throw new Error("Unsupported email type");
	}

	const { error } = await resend.emails.send({
		from: APP_CONFIG.email.fullSender,
		to,
		subject,
		html: htmlContent,
		replyTo: APP_CONFIG.email.replyTo,
	});

	if (error) {
		console.error("[sendEmail] resend_failed", { to, type, error });
		throw new Error(`Failed to send email: ${error.message}`);
	}
}
