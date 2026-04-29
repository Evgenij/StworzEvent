// src/schemas/faq-item.schema.ts
import { z } from "zod";

export const faqItemSchema = (t: (key: string) => string) =>
	z.object({
		question: z.string().min(5, t("min5")),
		answer: z.string().min(5, t("min5")),
	});

export type FaqItemInput = z.infer<ReturnType<typeof faqItemSchema>>;
