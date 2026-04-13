import { z } from "zod";

export const createEventSchema = (t: (key: string) => string) =>
	z
		.object({
			title: z.string().min(3, t("titleMin")).max(100, t("titleMax")),
			startsAt: z.string().min(1, t("required")),
			endsAt: z.string().optional(),
			location: z.string().optional(),
			street: z.string().optional(),
			streetNumber: z.string().optional(),
			ticketType: z.enum(["free", "paid"]),
			ticketPrice: z.number().min(0).optional(),
			ticketQuantity: z.number().int().min(1, t("required")),
			coverImage: z.string().optional(),
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
