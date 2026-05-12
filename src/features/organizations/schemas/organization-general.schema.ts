import { z } from "zod";
import { LegalForm, VatStatus, EmployeeCountRange } from "@prisma/client";

const optionalString = (max: number) =>
	z
		.string()
		.trim()
		.max(max)
		.nullable()
		.optional()
		.transform((v) => (v === "" ? null : (v ?? null)));

export const organizationGeneralSchema = (t: (key: string) => string) =>
	z.object({
		name: z
			.string()
			.trim()
			.min(2, t("nameMin"))
			.max(200, t("nameMax")),
		nip: z
			.string()
			.trim()
			.regex(/^\d{10}$/, t("nipFormat"))
			.nullable()
			.optional()
			.or(z.literal("").transform(() => null)),
		regon: z
			.string()
			.trim()
			.regex(/^(\d{9}|\d{14})$/, t("regonFormat"))
			.nullable()
			.optional()
			.or(z.literal("").transform(() => null)),
		krs: z
			.string()
			.trim()
			.regex(/^\d{10}$/, t("krsFormat"))
			.nullable()
			.optional()
			.or(z.literal("").transform(() => null)),
		legalForm: z.nativeEnum(LegalForm).nullable().optional(),
		legalFormCode: optionalString(10),
		vatStatus: z.nativeEnum(VatStatus).nullable().optional(),
		vatId: optionalString(20),
		website: z
			.string()
			.trim()
			.max(500)
			.refine((v) => !v || URL.canParse(v), { message: t("invalidUrl") })
			.nullable()
			.optional()
			.or(z.literal("").transform(() => null)),
		phone: optionalString(20),
		email: z
			.string()
			.trim()
			.email(t("invalidEmail"))
			.nullable()
			.optional()
			.or(z.literal("").transform(() => null)),
		industry: optionalString(100),
		mainPkdCode: optionalString(10),
		employeeCountRange: z.nativeEnum(EmployeeCountRange).nullable().optional(),
	});

export type OrganizationGeneralInput = z.infer<
	ReturnType<typeof organizationGeneralSchema>
>;

export type OrganizationGeneralFormValues = z.input<
	ReturnType<typeof organizationGeneralSchema>
>;

export const organizationGeneralServerSchema = organizationGeneralSchema(
	(k) => k,
);
