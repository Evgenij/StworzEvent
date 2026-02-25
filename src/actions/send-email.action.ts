// send-email.action.ts
"use server";

import { safeAction } from "@/lib/safe-action";
import { ApiError } from "@/error/api-error";
import { ErrorCode } from "@/types/error-code";
import transporter from "@/lib/nodemailer";
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
		throw new ApiError(ErrorCode.VALIDATION_ERROR, {
			to: ["Nieprawidłowy lub brak adresu email odbiorcy"],
		});
	}

	if (!subject || typeof subject !== "string" || subject.trim().length < 3) {
		throw new ApiError(ErrorCode.VALIDATION_ERROR, {
			subject: ["Temat wiadomości jest wymagany"],
		});
	}

	if (!type || !Object.values(TypeMail).includes(type)) {
		throw new ApiError(ErrorCode.VALIDATION_ERROR, {
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
			throw new ApiError(ErrorCode.INTERNAL_ERROR, {
				general: ["Nieobsługiwany typ wiadomości email"],
			});
	}

	// ─── Отправка письма ─────────────────────────────────────────
	try {
		await transporter.sendMail({
			from: '"StworzEvent.pl" <no-reply@stworzevent.pl>',
			to,
			subject,
			html: htmlContent,
		});

		return { success: true };
		// или: return { success: true, message: "Wiadomość wysłana pomyślnie" };
	} catch (err: any) {
		console.error("[sendEmailAction] failed", {
			to,
			subject,
			type,
			error: err?.message || err,
			stack: err?.stack,
		});

		// Более точная обработка типичных ошибок nodemailer (по желанию)
		if (err?.code === "EAUTH") {
			throw new ApiError(ErrorCode.INTERNAL_ERROR, {
				general: ["Błąd autoryzacji serwera SMTP"],
			});
		}

		if (err?.responseCode === 550) {
			throw new ApiError(ErrorCode.BAD_REQUEST, {
				to: ["Adres email nie istnieje lub jest zablokowany"],
			});
		}

		// остальные ошибки → INTERNAL_ERROR через safeAction
		throw err;
	}
});
