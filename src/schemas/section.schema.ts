// src/schemas/section.schema.ts
import { SectionType } from "@prisma/client";
import { z } from "zod";

// Только video и image нуждаются в t (валидация URL)
// TEXT не имеет валидируемых полей с сообщениями — не нужна t

export const sectionTextSchema = z.object({
	type: z.literal(SectionType.TEXT),
	title: z.string().optional(),
	content: z.record(z.string(), z.unknown()),
});

export const sectionLinksSchema = (t: (key: string) => string) =>
	z.object({
		type: z.literal(SectionType.LINKS),
		title: z.string().optional(),
		content: z.object({
			links: z.array(
				z.object({
					url: z.url(t("invalidUrl")),
					service: z.string(),
				}),
			),
		}),
	});

export const sectionVideoSchema = (t: (key: string) => string) =>
	z.object({
		type: z.literal(SectionType.VIDEO),
		title: z.string().optional(),
		content: z.object({
			url: z.url(t("invalidUrl")),
		}),
	});

export const sectionImageSchema = (t: (key: string) => string) =>
	z.object({
		type: z.literal(SectionType.IMAGE),
		title: z.string().optional(),
		content: z.object({
			images: z
				.array(
					z.object({
						url: z.url(t("invalidUrl")),
						alt: z.string().optional().default(""),
					}),
				)
				.min(1, t("min1")),
		}),
	});

// Схема без t — для сервера (parse без переводов)
export const sectionSchema = z.discriminatedUnion("type", [
	sectionTextSchema,
	sectionLinksSchema((key) => key),
	sectionVideoSchema((key) => key),
	sectionImageSchema((key) => key),
]);

// Схема с t — для клиента (валидация с переводами)
export const sectionSchemaWithTranslate = (t: (key: string) => string) =>
	z.discriminatedUnion("type", [
		sectionTextSchema,
		sectionLinksSchema(t),
		sectionVideoSchema(t),
		sectionImageSchema(t),
	]);

// Типы выводим из серверной схемы
export type SectionInput = z.infer<typeof sectionSchema>;
export type SectionTextInput = z.infer<typeof sectionTextSchema>;
export type SectionLinksInput = z.infer<ReturnType<typeof sectionLinksSchema>>;
export type SectionVideoInput = z.infer<ReturnType<typeof sectionVideoSchema>>;
export type SectionImageInput = z.infer<ReturnType<typeof sectionImageSchema>>;
