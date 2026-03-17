import { z } from "zod";

export const eventDetailsSchema = (t: (key: string) => string) =>
	z
		.object({
			startsAt: z.string().min(1, t("required")),
			endsAt: z.string().min(1, t("required")),
			location: z.string().min(2, t("min2")),
			address: z.string().min(5, t("min5")),
			categoryId: z.string().min(1, t("required")),
		})
		.superRefine((data, ctx) => {
			if (new Date(data.endsAt) <= new Date(data.startsAt)) {
				ctx.addIssue({
					code: "custom",
					message: t("endsAtAfterStartsAt"),
					path: ["endsAt"],
				});
			}
		});

export type EventDetailsInput = z.infer<ReturnType<typeof eventDetailsSchema>>;
