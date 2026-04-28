// src/schemas/order.schema.ts
import z from "zod";

export const participantSchema = (t: (key: string) => string) =>
	z.object({
		name: z.string().min(2, t("nameMin")),
		surname: z.string().min(2, t("surnameMin")),
		email: z.string().email(t("invalidEmail")),
		phone: z
			.string()
			.regex(/^\d{3}-\d{3}-\d{3}$/, t("invalidPhone"))
			.optional()
			.or(z.literal("")),
	});

export const orderFormSchema = (t: (key: string) => string) =>
	z
		.object({
			buyer: participantSchema(t),
			buyerIsParticipant: z.boolean(),
			buyerTicketGroupIdx: z.number(),
			participants: z.array(
				z.object({
					ticketId: z.string(),
					ticketName: z.string(),
					items: z.array(
						z.object({
							name: z.string(),
							surname: z.string(),
							email: z.string(),
							phone: z.string().optional(),
						}),
					),
				}),
			),
		})
		.superRefine((data, ctx) => {
			data.participants.forEach((group, gi) => {
				group.items.forEach((item, pi) => {
					// Пропускаем слот покупателя
					if (
						data.buyerIsParticipant &&
						gi === data.buyerTicketGroupIdx &&
						pi === 0
					)
						return;

					if (!item.name || item.name.length < 2) {
						ctx.addIssue({
							code: "custom",
							message: t("nameMin"),
							path: [`participants`, gi, `items`, pi, `name`],
						});
					}
					if (!item.surname || item.surname.length < 2) {
						ctx.addIssue({
							code: "custom",
							message: t("surnameMin"),
							path: [`participants`, gi, `items`, pi, `surname`],
						});
					}
					if (
						!item.email ||
						!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email)
					) {
						ctx.addIssue({
							code: "custom",
							message: t("invalidEmail"), // ← правильное
							path: [`participants`, gi, `items`, pi, `email`], // ← правильный path
						});
					}
				});
			});
		});

export type ParticipantFormValues = z.infer<
	ReturnType<typeof participantSchema>
>;
export type BuyerFormValues = ParticipantFormValues;
export type OrderFormValues = z.infer<ReturnType<typeof orderFormSchema>>;
