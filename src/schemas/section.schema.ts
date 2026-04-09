// src/schemas/section.schema.ts
import { SectionType } from "@prisma/client";
import { z } from "zod";

// Только video и image нуждаются в t (валидация URL)
// TEXT не имеет валидируемых полей с сообщениями — не нужна t

export const sectionTextSchema = (t: (key: string) => string) =>
	z.object({
		type: z.literal(SectionType.TEXT),
		title: z.string().min(1, t("required")),
		content: z
			.object({
				type: z.literal("doc"),
				content: z.array(z.unknown()),
			})
			.refine(
				(doc) => {
					const text =
						doc.content
							?.map(
								(node: any) =>
									(node as any).content
										?.map((n: any) => n.text ?? "")
										.join("") ?? "",
							)
							.join("") ?? "";
					return text.trim().length > 0;
				},
				{ message: t("required") },
			),
	});

export const sectionLinksSchema = (t: (key: string) => string) =>
	z.object({
		type: z.literal(SectionType.LINKS),
		title: z.string().min(1, t("required")),
		content: z.object({
			links: z
				.array(
					z.object({
						url: z
							.string()
							.min(1, t("required"))
							.refine(
								(val) => {
									try {
										new URL(val);
										return true;
									} catch {
										return false;
									}
								},
								{ message: t("invalidUrl") },
							),
						service: z.string(),
					}),
				)
				.min(1, t("minLinks")),
		}),
	});

export const sectionVideoSchema = (t: (key: string) => string) =>
	z.object({
		type: z.literal(SectionType.VIDEO),
		title: z.string().min(1, t("required")),
		content: z.object({
			url: z
				.string()
				.min(1, t("required"))
				.refine(
					(val) => {
						try {
							new URL(val);
							return true;
						} catch {
							return false;
						}
					},
					{ message: t("invalidUrl") },
				),
		}),
	});

export const sectionImageSchema = (t: (key: string) => string) =>
	z.object({
		type: z.literal(SectionType.IMAGE),
		title: z.string().min(1, t("required")),
		content: z.object({
			images: z
				.array(
					z.object({
						url: z.string(),
						alt: z.string(),
					}),
				)
				.min(1, t("min1")),
		}),
	});

// Схема без t — для сервера (parse без переводов)
export const sectionSchema = z.discriminatedUnion("type", [
	sectionTextSchema((key) => key),
	sectionLinksSchema((key) => key),
	sectionVideoSchema((key) => key),
	sectionImageSchema((key) => key),
]);

// Схема с t — для клиента (валидация с переводами)
export const sectionSchemaWithTranslate = (t: (key: string) => string) =>
	z.discriminatedUnion("type", [
		sectionTextSchema(t),
		sectionLinksSchema(t),
		sectionVideoSchema(t),
		sectionImageSchema(t),
	]);

// Типы выводим из серверной схемы
export type SectionInput = z.infer<typeof sectionSchema>;
export type SectionTextInput = z.infer<ReturnType<typeof sectionTextSchema>>;
export type SectionLinksInput = z.infer<ReturnType<typeof sectionLinksSchema>>;
export type SectionVideoInput = z.infer<ReturnType<typeof sectionVideoSchema>>;
export type SectionImageInput = z.infer<ReturnType<typeof sectionImageSchema>>;
