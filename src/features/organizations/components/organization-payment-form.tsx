"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PaymentMethod } from "@prisma/client";
import { useTranslations } from "next-intl";
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, FieldError } from "@/components/ui/field";
import { IconLoader } from "@tabler/icons-react";
import { toast } from "sonner";
import { formatIban, isValidPolishIban } from "@/lib/payment/iban";
import { updateOrganizationPaymentAction } from "@/features/organizations/actions/update-organization-payment.action";
import type { OrganizationPaymentInput } from "@/features/organizations/schemas/payment.schema";

type InitialData = {
	defaultPaymentMethod: PaymentMethod | null;
	defaultBankAccountNumber: string | null;
	defaultBankAccountHolder: string | null;
	defaultPaymentLink: string | null;
	defaultPaymentInstructions: string | null;
};

type Props = {
	organizationId: string;
	initialData: InitialData;
};

type SaveFn = (data: OrganizationPaymentInput) => Promise<void>;

function InstructionsField({
	value,
	onChange,
	placeholder,
	hint,
	label,
	error,
}: {
	value: string;
	onChange: (v: string) => void;
	placeholder: string;
	hint: string;
	label: string;
	error?: string;
}) {
	return (
		<Field>
			<Label className="text-sm font-medium">{label}</Label>
			<textarea
				className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				maxLength={2000}
				rows={3}
			/>
			<p className="text-xs text-muted-foreground">{hint}</p>
			{error && <FieldError>{error}</FieldError>}
		</Field>
	);
}

// ── BANK_TRANSFER ────────────────────────────────────────────────────────────

function BankTransferAccordion({
	isActive,
	onSaved,
	organizationId,
	initialBankAccountNumber,
	initialBankAccountHolder,
	initialInstructions,
}: {
	isActive: boolean;
	onSaved: () => void;
	organizationId: string;
	initialBankAccountNumber: string | null;
	initialBankAccountHolder: string | null;
	initialInstructions: string | null;
}) {
	const t = useTranslations("OrganizationSettings.payment");
	const tErrors = useTranslations("OrganizationSettings.payment.errors");
	const tRoot = useTranslations("OrganizationSettings");

	const schema = z.object({
		bankAccountNumber: z
			.string()
			.trim()
			.min(1, tErrors("required"))
			.max(40, tErrors("max40"))
			.refine((v) => isValidPolishIban(v), tErrors("invalidIban")),
		bankAccountHolder: z
			.string()
			.trim()
			.min(1, tErrors("required"))
			.max(120, tErrors("max120")),
		paymentInstructions: z
			.string()
			.trim()
			.max(2000, tErrors("max2000"))
			.optional()
			.transform((v) => (v === "" ? null : (v ?? null))),
	});

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			bankAccountNumber: initialBankAccountNumber ?? "",
			bankAccountHolder: initialBankAccountHolder ?? "",
			paymentInstructions: initialInstructions ?? "",
		},
	});

	const onSubmit = form.handleSubmit(async (data) => {
		const result = await updateOrganizationPaymentAction({
			organizationId,
			data: {
				defaultPaymentMethod: "BANK_TRANSFER",
				defaultBankAccountNumber: data.bankAccountNumber,
				defaultBankAccountHolder: data.bankAccountHolder,
				defaultPaymentLink: null,
				defaultPaymentInstructions: data.paymentInstructions ?? null,
			} as OrganizationPaymentInput,
		});
		if (!result.success) {
			toast.error(tErrors("default"));
			return;
		}
		toast.success(tRoot("saved"));
		onSaved();
	});

	return (
		<AccordionItem value="BANK_TRANSFER" className="border rounded-lg px-4">
			<AccordionTrigger className="gap-3">
				<span className="font-medium">{t("methods.BANK_TRANSFER")}</span>
				{isActive && (
					<Badge variant="secondary" className="ml-2">
						{t("active")}
					</Badge>
				)}
			</AccordionTrigger>
			<AccordionContent>
				<p className="text-sm text-muted-foreground mb-4">
					{t("methodDescriptions.BANK_TRANSFER")}
				</p>
				<form onSubmit={onSubmit} className="flex flex-col gap-4">
					<Controller
						control={form.control}
						name="bankAccountNumber"
						render={({ field, fieldState }) => (
							<Field>
								<Label className="text-sm font-medium">
									{t("bankAccountNumber")}
								</Label>
								<Input
									value={field.value}
									onChange={field.onChange}
									onBlur={(e) => {
										const raw = e.target.value;
										if (raw) field.onChange(formatIban(raw));
										field.onBlur();
									}}
									placeholder={t("bankAccountNumberPlaceholder")}
								/>
								{fieldState.error && (
									<FieldError>{fieldState.error.message}</FieldError>
								)}
							</Field>
						)}
					/>

					<Controller
						control={form.control}
						name="bankAccountHolder"
						render={({ field, fieldState }) => (
							<Field>
								<Label className="text-sm font-medium">
									{t("bankAccountHolder")}
								</Label>
								<Input
									{...field}
									placeholder={t("bankAccountHolderPlaceholder")}
								/>
								{fieldState.error && (
									<FieldError>{fieldState.error.message}</FieldError>
								)}
							</Field>
						)}
					/>

					<Controller
						control={form.control}
						name="paymentInstructions"
						render={({ field, fieldState }) => (
							<InstructionsField
								label={t("paymentInstructions")}
								value={field.value ?? ""}
								onChange={field.onChange}
								placeholder={t("paymentInstructionsPlaceholder")}
								hint={t("paymentInstructionsHint")}
								error={fieldState.error?.message}
							/>
						)}
					/>

					<Button
						type="submit"
						disabled={form.formState.isSubmitting}
						className="w-fit"
					>
						{form.formState.isSubmitting && (
							<IconLoader className="size-4 animate-spin mr-2" />
						)}
						{t("save")}
					</Button>
				</form>
			</AccordionContent>
		</AccordionItem>
	);
}

// ── EXTERNAL_LINK ────────────────────────────────────────────────────────────

function ExternalLinkAccordion({
	isActive,
	onSaved,
	organizationId,
	initialPaymentLink,
	initialInstructions,
}: {
	isActive: boolean;
	onSaved: () => void;
	organizationId: string;
	initialPaymentLink: string | null;
	initialInstructions: string | null;
}) {
	const t = useTranslations("OrganizationSettings.payment");
	const tErrors = useTranslations("OrganizationSettings.payment.errors");
	const tRoot = useTranslations("OrganizationSettings");

	const schema = z.object({
		paymentLink: z
			.string()
			.trim()
			.min(1, tErrors("required"))
			.max(500, tErrors("max500"))
			.refine((v) => URL.canParse(v), tErrors("invalidUrl")),
		paymentInstructions: z
			.string()
			.trim()
			.max(2000, tErrors("max2000"))
			.optional()
			.transform((v) => (v === "" ? null : (v ?? null))),
	});

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			paymentLink: initialPaymentLink ?? "",
			paymentInstructions: initialInstructions ?? "",
		},
	});

	const onSubmit = form.handleSubmit(async (data) => {
		const result = await updateOrganizationPaymentAction({
			organizationId,
			data: {
				defaultPaymentMethod: "EXTERNAL_LINK",
				defaultBankAccountNumber: null,
				defaultBankAccountHolder: null,
				defaultPaymentLink: data.paymentLink,
				defaultPaymentInstructions: data.paymentInstructions ?? null,
			} as OrganizationPaymentInput,
		});
		if (!result.success) {
			toast.error(tErrors("default"));
			return;
		}
		toast.success(tRoot("saved"));
		onSaved();
	});

	return (
		<AccordionItem value="EXTERNAL_LINK" className="border rounded-lg px-4">
			<AccordionTrigger className="gap-3">
				<span className="font-medium">{t("methods.EXTERNAL_LINK")}</span>
				{isActive && (
					<Badge variant="secondary" className="ml-2">
						{t("active")}
					</Badge>
				)}
			</AccordionTrigger>
			<AccordionContent>
				<p className="text-sm text-muted-foreground mb-4">
					{t("methodDescriptions.EXTERNAL_LINK")}
				</p>
				<form onSubmit={onSubmit} className="flex flex-col gap-4">
					<Controller
						control={form.control}
						name="paymentLink"
						render={({ field, fieldState }) => (
							<Field>
								<Label className="text-sm font-medium">
									{t("paymentLink")}
								</Label>
								<Input
									type="url"
									{...field}
									placeholder={t("paymentLinkPlaceholder")}
								/>
								{fieldState.error && (
									<FieldError>{fieldState.error.message}</FieldError>
								)}
							</Field>
						)}
					/>

					<Controller
						control={form.control}
						name="paymentInstructions"
						render={({ field, fieldState }) => (
							<InstructionsField
								label={t("paymentInstructions")}
								value={field.value ?? ""}
								onChange={field.onChange}
								placeholder={t("paymentInstructionsPlaceholder")}
								hint={t("paymentInstructionsHint")}
								error={fieldState.error?.message}
							/>
						)}
					/>

					<Button
						type="submit"
						disabled={form.formState.isSubmitting}
						className="w-fit"
					>
						{form.formState.isSubmitting && (
							<IconLoader className="size-4 animate-spin mr-2" />
						)}
						{t("save")}
					</Button>
				</form>
			</AccordionContent>
		</AccordionItem>
	);
}

// ── CASH_AT_ENTRANCE ─────────────────────────────────────────────────────────

function CashAtEntranceAccordion({
	isActive,
	onSaved,
	organizationId,
	initialInstructions,
}: {
	isActive: boolean;
	onSaved: () => void;
	organizationId: string;
	initialInstructions: string | null;
}) {
	const t = useTranslations("OrganizationSettings.payment");
	const tErrors = useTranslations("OrganizationSettings.payment.errors");
	const tRoot = useTranslations("OrganizationSettings");

	const schema = z.object({
		paymentInstructions: z
			.string()
			.trim()
			.max(2000, tErrors("max2000"))
			.optional()
			.transform((v) => (v === "" ? null : (v ?? null))),
	});

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: { paymentInstructions: initialInstructions ?? "" },
	});

	const onSubmit = form.handleSubmit(async (data) => {
		const result = await updateOrganizationPaymentAction({
			organizationId,
			data: {
				defaultPaymentMethod: "CASH_AT_ENTRANCE",
				defaultBankAccountNumber: null,
				defaultBankAccountHolder: null,
				defaultPaymentLink: null,
				defaultPaymentInstructions: data.paymentInstructions ?? null,
			} as OrganizationPaymentInput,
		});
		if (!result.success) {
			toast.error(tErrors("default"));
			return;
		}
		toast.success(tRoot("saved"));
		onSaved();
	});

	return (
		<AccordionItem
			value="CASH_AT_ENTRANCE"
			className="border rounded-lg px-4"
		>
			<AccordionTrigger className="gap-3">
				<span className="font-medium">
					{t("methods.CASH_AT_ENTRANCE")}
				</span>
				{isActive && (
					<Badge variant="secondary" className="ml-2">
						{t("active")}
					</Badge>
				)}
			</AccordionTrigger>
			<AccordionContent>
				<p className="text-sm text-muted-foreground mb-4">
					{t("methodDescriptions.CASH_AT_ENTRANCE")}
				</p>
				<form onSubmit={onSubmit} className="flex flex-col gap-4">
					<Controller
						control={form.control}
						name="paymentInstructions"
						render={({ field, fieldState }) => (
							<InstructionsField
								label={t("paymentInstructions")}
								value={field.value ?? ""}
								onChange={field.onChange}
								placeholder={t("paymentInstructionsPlaceholder")}
								hint={t("paymentInstructionsHint")}
								error={fieldState.error?.message}
							/>
						)}
					/>

					<Button
						type="submit"
						disabled={form.formState.isSubmitting}
						className="w-fit"
					>
						{form.formState.isSubmitting && (
							<IconLoader className="size-4 animate-spin mr-2" />
						)}
						{t("save")}
					</Button>
				</form>
			</AccordionContent>
		</AccordionItem>
	);
}

// ── FREE ─────────────────────────────────────────────────────────────────────

function FreeAccordion({
	isActive,
	onSaved,
	organizationId,
}: {
	isActive: boolean;
	onSaved: () => void;
	organizationId: string;
}) {
	const t = useTranslations("OrganizationSettings.payment");
	const tErrors = useTranslations("OrganizationSettings.payment.errors");
	const tRoot = useTranslations("OrganizationSettings");

	const [submitting, setSubmitting] = useState(false);

	const handleSave = async () => {
		setSubmitting(true);
		try {
			const result = await updateOrganizationPaymentAction({
				organizationId,
				data: {
					defaultPaymentMethod: "FREE",
					defaultBankAccountNumber: null,
					defaultBankAccountHolder: null,
					defaultPaymentLink: null,
					defaultPaymentInstructions: null,
				} as OrganizationPaymentInput,
			});
			if (!result.success) {
				toast.error(tErrors("default"));
				return;
			}
			toast.success(tRoot("saved"));
			onSaved();
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<AccordionItem value="FREE" className="border rounded-lg px-4">
			<AccordionTrigger className="gap-3">
				<span className="font-medium">{t("methods.FREE")}</span>
				{isActive && (
					<Badge variant="secondary" className="ml-2">
						{t("active")}
					</Badge>
				)}
			</AccordionTrigger>
			<AccordionContent>
				<p className="text-sm text-muted-foreground mb-4">
					{t("methodDescriptions.FREE")}
				</p>
				<Button
					type="button"
					onClick={handleSave}
					disabled={submitting}
					className="w-fit"
				>
					{submitting && (
						<IconLoader className="size-4 animate-spin mr-2" />
					)}
					{t("save")}
				</Button>
			</AccordionContent>
		</AccordionItem>
	);
}

// ── Main component ────────────────────────────────────────────────────────────

export function OrganizationPaymentForm({ organizationId, initialData }: Props) {
	const [activeMethod, setActiveMethod] = useState<PaymentMethod | null>(
		initialData.defaultPaymentMethod,
	);

	return (
		<Accordion
			type="single"
			collapsible
			defaultValue={initialData.defaultPaymentMethod ?? undefined}
			className="flex flex-col gap-3"
		>
			<BankTransferAccordion
				isActive={activeMethod === "BANK_TRANSFER"}
				onSaved={() => setActiveMethod("BANK_TRANSFER")}
				organizationId={organizationId}
				initialBankAccountNumber={initialData.defaultBankAccountNumber}
				initialBankAccountHolder={initialData.defaultBankAccountHolder}
				initialInstructions={initialData.defaultPaymentInstructions}
			/>
			<ExternalLinkAccordion
				isActive={activeMethod === "EXTERNAL_LINK"}
				onSaved={() => setActiveMethod("EXTERNAL_LINK")}
				organizationId={organizationId}
				initialPaymentLink={initialData.defaultPaymentLink}
				initialInstructions={initialData.defaultPaymentInstructions}
			/>
			<CashAtEntranceAccordion
				isActive={activeMethod === "CASH_AT_ENTRANCE"}
				onSaved={() => setActiveMethod("CASH_AT_ENTRANCE")}
				organizationId={organizationId}
				initialInstructions={initialData.defaultPaymentInstructions}
			/>
			<FreeAccordion
				isActive={activeMethod === "FREE"}
				onSaved={() => setActiveMethod("FREE")}
				organizationId={organizationId}
			/>
		</Accordion>
	);
}
