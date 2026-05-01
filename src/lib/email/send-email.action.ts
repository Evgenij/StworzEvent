// send-email.action.ts
"use server";

import { safeAction } from "@/lib/safe-action";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";
import resend from "@/lib/resend";
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
import { TypeMail } from "@/types/enums";
import { APP_CONFIG } from "@/config/app";

type EmailPayload =
	| { type: TypeMail.INVITATION; data: InvitationMailsProps }
	| { type: TypeMail.AUTH; data: AuthMailsProps }
	| { type: TypeMail.CODE; data: CodeMailsProps }
	| {
			type: TypeMail.ORDER_PAYMENT_INSTRUCTIONS;
			data: OrderPaymentInstructionsMailProps;
	  }
	| { type: TypeMail.ORDER_ORGANIZER_NOTIFY; data: OrganizerNewOrderMailProps }
	| { type: TypeMail.ORDER_TICKETS; data: OrderTicketsMailProps }
	| { type: TypeMail.ORDER_REMINDER; data: OrderReminderMailProps };

type SendEmailInput = EmailPayload & {
	to: string;
	subject: string;
};

export const sendEmailAction = safeAction(async (input: SendEmailInput) => {
	const { type, to, subject, data } = input;

	// ─── Валидация входных данных ────────────────────────────────
	if (!to || typeof to !== "string" || !to.includes("@")) {
		throw new ApiError(ErrorCode.VALIDATION_ERROR, 422, {
			to: ["Nieprawidłowy lub brak adresu email odbiorcy"],
		});
	}

	if (!subject || typeof subject !== "string" || subject.trim().length < 3) {
		throw new ApiError(ErrorCode.VALIDATION_ERROR, 422, {
			subject: ["Temat wiadomości jest wymagany"],
		});
	}

	if (!type || !Object.values(TypeMail).includes(type)) {
		throw new ApiError(ErrorCode.VALIDATION_ERROR, 422, {
			type: ["Nieprawidłowy typ wiadomości email"],
		});
	}

	// ─── Генерация содержимого письма ────────────────────────────
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
			throw new ApiError(ErrorCode.INTERNAL_ERROR, 500, {
				general: ["Nieobsługiwany typ wiadomości email"],
			});
	}

	// ─── Отправка письма ─────────────────────────────────────────
	const { error } = await resend.emails.send({
		from: APP_CONFIG.email.fullSender,
		to,
		subject,
		html: htmlContent,
		replyTo: APP_CONFIG.email.replyTo,
	});

	if (error) {
		// Детали — только в серверный лог, клиенту общее сообщение
		console.error("[sendEmailAction] resend_failed", {
			to: input.to,
			type: input.type,
			resendError: error,
		});
		throw new ApiError(ErrorCode.INTERNAL_ERROR, 500, {
			general: ["Nieudana wysłanie email"],
		});
	}
});
