import { z } from "zod";

export const createEventSchema = (t: (key: string) => string) =>
	z
		.object({
			title: z.string().min(3, t("titleMin")).max(100, t("titleMax")),
			startsAt: z.string().min(1, t("required")),
			endsAt: z.string().optional(),
			location: z.string().min(1, t("required")),
			street: z.string().optional(),
			streetNumber: z.string().optional(),
			ticketType: z.enum(["free", "paid"]),
			ticketPrice: z.number().min(0).optional(),
			payAtEntrance: z.boolean().optional(),
			publishImmediately: z.boolean().optional(),
			ticketQuantity: z.number().int().nullable(),
			coverImage: z.string().nullable(),
		})
		.superRefine((data, ctx) => {
			if (data.ticketType === "paid" && !data.ticketPrice) {
				ctx.addIssue({
					code: "custom",
					path: ["ticketPrice"],
					message: t("required"),
				});
			}
		});

export type CreateEventInput = z.infer<ReturnType<typeof createEventSchema>>;

export const createEventServerSchema = createEventSchema((key) => key);
