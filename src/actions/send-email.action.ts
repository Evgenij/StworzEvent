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
} from "@/helpers/mail-templates";
import { TypeMail } from "@/types/enums";

type EmailPayload =
	| { type: TypeMail.INVITATION; data: InvitationMailsProps }
	| { type: TypeMail.AUTH; data: AuthMailsProps }
	| { type: TypeMail.CODE; data: CodeMailsProps };

type SendEmailInput = EmailPayload & {
	to: string;
	subject: string;
};

export const sendEmailAction = safeAction(async (input: SendEmailInput) => {
	const { type, to, subject, data } = input;

	// ─── Валидация входных данных ────────────────────────────────
	if (!to || typeof to !== "string" || !to.includes("@")) {
		throw new ApiError(ErrorCode.VALIDATION_ERROR, 500, {
			to: ["Nieprawidłowy lub brak adresu email odbiorcy"],
		});
	}

	if (!subject || typeof subject !== "string" || subject.trim().length < 3) {
		throw new ApiError(ErrorCode.VALIDATION_ERROR, 500, {
			subject: ["Temat wiadomości jest wymagany"],
		});
	}

	if (!type || !Object.values(TypeMail).includes(type)) {
		throw new ApiError(ErrorCode.VALIDATION_ERROR, 500, {
			type: ["Nieprawidłowy typ wiadomości email"],
		});
	}

	// ─── Генерация содержимого письма ────────────────────────────
	let htmlContent: string;

	switch (type) {
		case TypeMail.INVITATION:
			htmlContent = invitationMail(data as InvitationMailsProps);
			break;

		case TypeMail.CODE:
			htmlContent = codeMail(data as CodeMailsProps);
			break;

		case TypeMail.AUTH:
			htmlContent = authMail(data as AuthMailsProps);
			break;

		default:
			throw new ApiError(ErrorCode.INTERNAL_ERROR, 500, {
				general: ["Nieobsługiwany typ wiadomości email"],
			});
	}

	// ─── Отправка письма ─────────────────────────────────────────
	const { error } = await resend.emails.send({
		from: "StworzEvent.pl <no-reply@stworzevent.pl>",
		to,
		subject,
		html: htmlContent,
	});

	if (error) {
		console.error("[sendEmailAction] failed", { to, subject, type, error });
		throw new ApiError(ErrorCode.INTERNAL_ERROR, 500, {
			general: [error.message],
		});
	}

	return { success: true };
});
