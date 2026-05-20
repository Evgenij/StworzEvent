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
		name: z.string().trim().min(2, t("nameMin")).max(200, t("nameMax")),
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
		legalFormCode: z
			.string()
			.trim()
			.regex(/^\d{3}$/, t("legalFormCodeFormat"))
			.nullable()
			.optional()
			.or(z.literal("").transform(() => null)),
		vatStatus: z.nativeEnum(VatStatus).nullable().optional(),
		vatId: z
			.string()
			.trim()
			.regex(/^PL\d{10}$/, t("vatIdFormat"))
			.nullable()
			.optional()
			.or(z.literal("").transform(() => null)),
		website: z
			.string()
			.trim()
			.url(t("invalidUrl"))
			.nullable()
			.optional()
			.or(z.literal("").transform(() => null)),
		phone: z
			.string()
			.trim()
			.refine((v) => !v || v.length >= 11, { message: t("phoneInvalid") })
			.nullable()
			.optional()
			.or(z.literal("").transform(() => null)),
		email: z
			.email(t("invalidEmail"))
			.nullable()
			.optional()
			.or(z.literal("").transform(() => null)),
		industry: optionalString(100),
		mainPkdCode: z
			.string()
			.trim()
			.max(20, t("mainPkdCodeInvalid"))
			.nullable()
			.optional()
			.or(z.literal("").transform(() => null)),
		employeeCountRange: z
			.nativeEnum(EmployeeCountRange)
			.nullable()
			.optional(),
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
