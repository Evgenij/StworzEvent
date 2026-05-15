"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PaymentMethod } from "@prisma/client";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, FieldError } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import {
	IconLoader,
	IconBuildingBank,
	IconExternalLink,
	IconCash,
	IconGift,
	IconInfoCircle,
	IconEye,
	IconStar,
	IconDeviceFloppy,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatIban, isValidPolishIban } from "@/lib/payment/iban";
import {
	updatePaymentMethodAction,
	togglePaymentMethodAction,
} from "@/features/organizations/actions/update-payment-method.action";
import { setDefaultPaymentMethodAction } from "@/features/organizations/actions/set-default-payment-method.action";

// ── Types ──────────────────────────────────────────────────────────────────────

type InitialData = {
	enabledPaymentMethods: PaymentMethod[];
	defaultPaymentMethod: PaymentMethod | null;
	bankAccountNumber: string | null;
	bankAccountHolder: string | null;
	bankName: string | null;
	bankTransferInstructions: string | null;
	paymentLink: string | null;
	externalLinkInstructions: string | null;
	cashAtEntranceInstructions: string | null;
	freeInstructions: string | null;
};

type Props = {
	organizationId: string;
	initialData: InitialData;
};

// ── Constants ──────────────────────────────────────────────────────────────────

const METHODS: PaymentMethod[] = [
	"BANK_TRANSFER",
	"EXTERNAL_LINK",
	"CASH_AT_ENTRANCE",
	"FREE",
];

const METHOD_ICONS = {
	BANK_TRANSFER: IconBuildingBank,
	EXTERNAL_LINK: IconExternalLink,
	CASH_AT_ENTRANCE: IconCash,
	FREE: IconGift,
} as const;

// ── Shared helpers ─────────────────────────────────────────────────────────────

function OptionalBadge({ label }: { label: string }) {
	return (
		<span className="text-xs text-primary font-normal ml-1">{label}</span>
	);
}

function RequiredMark() {
	return <span className="text-destructive ml-0.5">*</span>;
}

function InstructionsField({
	value,
	onChange,
	placeholder,
	hint,
	label,
	error,
	optional,
}: {
	value: string;
	onChange: (v: string) => void;
	placeholder: string;
	hint: string;
	label: string;
	error?: string;
	optional?: string;
}) {
	return (
		<Field>
			<Label className="text-sm font-medium">
				{label}
				{optional && <OptionalBadge label={optional} />}
			</Label>
			<textarea
				className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				maxLength={2000}
				rows={3}
			/>
			<p className="flex items-center gap-1 text-xs text-muted-foreground">
				<IconEye className="size-3 shrink-0" />
				{hint}
			</p>
			{error && <FieldError>{error}</FieldError>}
		</Field>
	);
}

// ── Panel header ───────────────────────────────────────────────────────────────

function PanelHeader({
	method,
	isEnabled,
	onToggle,
	busy,
}: {
	method: PaymentMethod;
	isEnabled: boolean;
	onToggle?: (checked: boolean) => void;
	busy?: boolean;
}) {
	const t = useTranslations("OrganizationSettings.payment");
	const Icon = METHOD_ICONS[method];
	const isFree = method === "FREE";

	return (
		<div
			className={cn(
				"flex items-start justify-between p-4 border-b gap-4",
				isFree
					? "bg-emerald-50 dark:bg-emerald-950/20"
					: isEnabled
						? "bg-primary/5"
						: "bg-muted/40",
			)}
		>
			<div className="flex items-start gap-3">
				<div
					className={cn(
						"p-2 rounded-md shrink-0",
						isFree
							? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
							: isEnabled
								? "bg-primary/10 text-primary"
								: "bg-muted text-muted-foreground",
					)}
				>
					<Icon className="size-5" />
				</div>
				<div>
					<p className="font-semibold text-sm">
						{t(`methods.${method}`)}
					</p>
					<p className="text-sm text-muted-foreground">
						{t(`methodDescriptions.${method}`)}
					</p>
				</div>
			</div>

			{isFree ? (
				<span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mt-1 shrink-0">
					{t("auto")}
				</span>
			) : (
				<Switch
					checked={isEnabled}
					onCheckedChange={onToggle}
					disabled={busy}
					className="mt-1 shrink-0"
				/>
			)}
		</div>
	);
}

// ── Shared form footer ─────────────────────────────────────────────────────────

function FormFooter({
	onSave,
	onCancel,
	onSetDefault,
	isSubmitting,
}: {
	onSave: () => void;
	onCancel: () => void;
	onSetDefault?: () => void;
	isSubmitting: boolean;
}) {
	const t = useTranslations("OrganizationSettings.payment");
	return (
		<div className="flex items-center justify-between pt-4 mt-2 border-t">
			<div className="flex items-center gap-2">
				<Button
					type="button"
					onClick={onSave}
					disabled={isSubmitting}
					className="gap-2"
				>
					{isSubmitting ? (
						<IconLoader className="size-4 animate-spin" />
					) : (
						<IconDeviceFloppy className="size-4" />
					)}
					{t("save")}
				</Button>
				<Button
					type="button"
					variant="ghost"
					onClick={onCancel}
					disabled={isSubmitting}
				>
					{t("cancel")}
				</Button>
			</div>
			{onSetDefault && (
				<Button
					type="button"
					variant="ghost"
					onClick={onSetDefault}
					disabled={isSubmitting}
					className="gap-1.5 text-muted-foreground hover:text-foreground"
				>
					<IconStar className="size-4" />
					{t("setAsDefault")}
				</Button>
			)}
		</div>
	);
}

// ── BANK_TRANSFER ──────────────────────────────────────────────────────────────

function BankTransferPanel({
	organizationId,
	isEnabled,
	isDefault,
	initialData,
	onEnabledChange,
	onDefaultChange,
}: {
	organizationId: string;
	isEnabled: boolean;
	isDefault: boolean;
	initialData: {
		bankAccountNumber: string | null;
		bankAccountHolder: string | null;
		bankName: string | null;
		instructions: string | null;
	};
	onEnabledChange: (enabled: boolean) => void;
	onDefaultChange: () => void;
}) {
	const t = useTranslations("OrganizationSettings.payment");
	const tErrors = useTranslations("OrganizationSettings.payment.errors");
	const tRoot = useTranslations("OrganizationSettings");
	const [busy, setBusy] = useState(false);

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
		bankName: z
			.string()
			.trim()
			.max(120, tErrors("max120"))
			.optional()
			.transform((v) => (v === "" ? null : (v ?? null))),
		instructions: z
			.string()
			.trim()
			.max(2000, tErrors("max2000"))
			.optional()
			.transform((v) => (v === "" ? null : (v ?? null))),
	});

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			bankAccountNumber: initialData.bankAccountNumber ?? "",
			bankAccountHolder: initialData.bankAccountHolder ?? "",
			bankName: initialData.bankName ?? "",
			instructions: initialData.instructions ?? "",
		},
	});

	const saveData = form.handleSubmit(async (data) => {
		const result = await updatePaymentMethodAction({
			organizationId,
			method: "BANK_TRANSFER",
			bankAccountNumber: data.bankAccountNumber,
			bankAccountHolder: data.bankAccountHolder,
			bankName: data.bankName ?? null,
			instructions: data.instructions ?? null,
		});
		if (!result.success) {
			toast.error(tErrors("default"));
			return;
		}
		toast.success(tRoot("saved"));
	});

	const handleToggle = async (checked: boolean) => {
		if (checked) {
			// validate + save data, then enable
			const valid = await form.trigger();
			if (!valid) return;
			setBusy(true);
			try {
				await saveData();
				const r = await togglePaymentMethodAction({
					organizationId,
					method: "BANK_TRANSFER",
					enabled: true,
				});
				if (r.success) onEnabledChange(true);
				else toast.error(tErrors("default"));
			} finally {
				setBusy(false);
			}
		} else {
			setBusy(true);
			try {
				const r = await togglePaymentMethodAction({
					organizationId,
					method: "BANK_TRANSFER",
					enabled: false,
				});
				if (r.success) onEnabledChange(false);
				else toast.error(tErrors("default"));
			} finally {
				setBusy(false);
			}
		}
	};

	const handleSetDefault = async () => {
		setBusy(true);
		try {
			const r = await setDefaultPaymentMethodAction({
				organizationId,
				method: "BANK_TRANSFER",
			});
			if (r.success) {
				toast.success(tRoot("saved"));
				onDefaultChange();
			} else {
				toast.error(tErrors("default"));
			}
		} finally {
			setBusy(false);
		}
	};

	return (
		<>
			<PanelHeader
				method="BANK_TRANSFER"
				isEnabled={isEnabled}
				onToggle={handleToggle}
				busy={busy}
			/>
			<form onSubmit={saveData} className="p-4 flex flex-col gap-4">
				<Controller
					control={form.control}
					name="bankAccountNumber"
					render={({ field, fieldState }) => (
						<Field>
							<Label className="text-sm font-medium">
								{t("bankAccountNumber")}
								<RequiredMark />
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
							<p className="flex items-center gap-1 text-xs text-muted-foreground bg-muted rounded px-2 py-1 w-fit">
								<IconInfoCircle className="size-3 shrink-0" />
								{t("bankAccountNumberHint")}
							</p>
							{fieldState.error && (
								<FieldError>
									{fieldState.error.message}
								</FieldError>
							)}
						</Field>
					)}
				/>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<Controller
						control={form.control}
						name="bankAccountHolder"
						render={({ field, fieldState }) => (
							<Field>
								<Label className="text-sm font-medium">
									{t("bankAccountHolder")}
									<RequiredMark />
								</Label>
								<Input
									{...field}
									placeholder={t(
										"bankAccountHolderPlaceholder",
									)}
								/>
								{fieldState.error && (
									<FieldError>
										{fieldState.error.message}
									</FieldError>
								)}
							</Field>
						)}
					/>
					<Controller
						control={form.control}
						name="bankName"
						render={({ field, fieldState }) => (
							<Field>
								<Label className="text-sm font-medium">
									{t("bankName")}
									<OptionalBadge label={t("optional")} />
								</Label>
								<Input
									{...field}
									placeholder={t("bankNamePlaceholder")}
								/>
								{fieldState.error && (
									<FieldError>
										{fieldState.error.message}
									</FieldError>
								)}
							</Field>
						)}
					/>
				</div>

				<Controller
					control={form.control}
					name="instructions"
					render={({ field, fieldState }) => (
						<InstructionsField
							label={t("paymentInstructions")}
							optional={t("optional")}
							value={field.value ?? ""}
							onChange={field.onChange}
							placeholder={t("paymentInstructionsPlaceholder")}
							hint={t("paymentInstructionsHint")}
							error={fieldState.error?.message}
						/>
					)}
				/>

				<FormFooter
					onSave={saveData}
					onCancel={() => form.reset()}
					onSetDefault={!isDefault ? handleSetDefault : undefined}
					isSubmitting={form.formState.isSubmitting || busy}
				/>
			</form>
		</>
	);
}

// ── EXTERNAL_LINK ──────────────────────────────────────────────────────────────

function ExternalLinkPanel({
	organizationId,
	isEnabled,
	isDefault,
	initialData,
	onEnabledChange,
	onDefaultChange,
}: {
	organizationId: string;
	isEnabled: boolean;
	isDefault: boolean;
	initialData: { paymentLink: string | null; instructions: string | null };
	onEnabledChange: (enabled: boolean) => void;
	onDefaultChange: () => void;
}) {
	const t = useTranslations("OrganizationSettings.payment");
	const tErrors = useTranslations("OrganizationSettings.payment.errors");
	const tRoot = useTranslations("OrganizationSettings");
	const [busy, setBusy] = useState(false);

	const schema = z.object({
		paymentLink: z
			.string()
			.trim()
			.min(1, tErrors("required"))
			.max(500, tErrors("max500"))
			.refine((v) => URL.canParse(v), tErrors("invalidUrl")),
		instructions: z
			.string()
			.trim()
			.max(2000, tErrors("max2000"))
			.optional()
			.transform((v) => (v === "" ? null : (v ?? null))),
	});

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			paymentLink: initialData.paymentLink ?? "",
			instructions: initialData.instructions ?? "",
		},
	});

	const saveData = form.handleSubmit(async (data) => {
		const result = await updatePaymentMethodAction({
			organizationId,
			method: "EXTERNAL_LINK",
			paymentLink: data.paymentLink,
			instructions: data.instructions ?? null,
		});
		if (!result.success) {
			toast.error(tErrors("default"));
			return;
		}
		toast.success(tRoot("saved"));
	});

	const handleToggle = async (checked: boolean) => {
		if (checked) {
			const valid = await form.trigger();
			if (!valid) return;
			setBusy(true);
			try {
				await saveData();
				const r = await togglePaymentMethodAction({
					organizationId,
					method: "EXTERNAL_LINK",
					enabled: true,
				});
				if (r.success) onEnabledChange(true);
				else toast.error(tErrors("default"));
			} finally {
				setBusy(false);
			}
		} else {
			setBusy(true);
			try {
				const r = await togglePaymentMethodAction({
					organizationId,
					method: "EXTERNAL_LINK",
					enabled: false,
				});
				if (r.success) onEnabledChange(false);
				else toast.error(tErrors("default"));
			} finally {
				setBusy(false);
			}
		}
	};

	const handleSetDefault = async () => {
		setBusy(true);
		try {
			const r = await setDefaultPaymentMethodAction({
				organizationId,
				method: "EXTERNAL_LINK",
			});
			if (r.success) {
				toast.success(tRoot("saved"));
				onDefaultChange();
			} else {
				toast.error(tErrors("default"));
			}
		} finally {
			setBusy(false);
		}
	};

	return (
		<>
			<PanelHeader
				method="EXTERNAL_LINK"
				isEnabled={isEnabled}
				onToggle={handleToggle}
				busy={busy}
			/>
			<form onSubmit={saveData} className="p-4 flex flex-col gap-4">
				<Controller
					control={form.control}
					name="paymentLink"
					render={({ field, fieldState }) => (
						<Field>
							<Label className="text-sm font-medium">
								{t("paymentLink")}
								<RequiredMark />
							</Label>
							<Input
								type="url"
								{...field}
								placeholder={t("paymentLinkPlaceholder")}
							/>
							{fieldState.error && (
								<FieldError>
									{fieldState.error.message}
								</FieldError>
							)}
						</Field>
					)}
				/>

				<Controller
					control={form.control}
					name="instructions"
					render={({ field, fieldState }) => (
						<InstructionsField
							label={t("paymentInstructions")}
							optional={t("optional")}
							value={field.value ?? ""}
							onChange={field.onChange}
							placeholder={t("paymentInstructionsPlaceholder")}
							hint={t("paymentInstructionsHint")}
							error={fieldState.error?.message}
						/>
					)}
				/>

				<FormFooter
					onSave={saveData}
					onCancel={() => form.reset()}
					onSetDefault={!isDefault && isEnabled ? handleSetDefault : undefined}
					isSubmitting={form.formState.isSubmitting || busy}
				/>
			</form>
		</>
	);
}

// ── CASH_AT_ENTRANCE ───────────────────────────────────────────────────────────

function CashAtEntrancePanel({
	organizationId,
	isEnabled,
	isDefault,
	initialData,
	onEnabledChange,
	onDefaultChange,
}: {
	organizationId: string;
	isEnabled: boolean;
	isDefault: boolean;
	initialData: { instructions: string | null };
	onEnabledChange: (enabled: boolean) => void;
	onDefaultChange: () => void;
}) {
	const t = useTranslations("OrganizationSettings.payment");
	const tErrors = useTranslations("OrganizationSettings.payment.errors");
	const tRoot = useTranslations("OrganizationSettings");
	const [busy, setBusy] = useState(false);

	const schema = z.object({
		instructions: z
			.string()
			.trim()
			.max(2000, tErrors("max2000"))
			.optional()
			.transform((v) => (v === "" ? null : (v ?? null))),
	});

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: { instructions: initialData.instructions ?? "" },
	});

	const saveData = form.handleSubmit(async (data) => {
		const result = await updatePaymentMethodAction({
			organizationId,
			method: "CASH_AT_ENTRANCE",
			instructions: data.instructions ?? null,
		});
		if (!result.success) {
			toast.error(tErrors("default"));
			return;
		}
		toast.success(tRoot("saved"));
	});

	const handleToggle = async (checked: boolean) => {
		if (checked) {
			setBusy(true);
			try {
				await saveData();
				const r = await togglePaymentMethodAction({
					organizationId,
					method: "CASH_AT_ENTRANCE",
					enabled: true,
				});
				if (r.success) onEnabledChange(true);
				else toast.error(tErrors("default"));
			} finally {
				setBusy(false);
			}
		} else {
			setBusy(true);
			try {
				const r = await togglePaymentMethodAction({
					organizationId,
					method: "CASH_AT_ENTRANCE",
					enabled: false,
				});
				if (r.success) onEnabledChange(false);
				else toast.error(tErrors("default"));
			} finally {
				setBusy(false);
			}
		}
	};

	const handleSetDefault = async () => {
		setBusy(true);
		try {
			const r = await setDefaultPaymentMethodAction({
				organizationId,
				method: "CASH_AT_ENTRANCE",
			});
			if (r.success) {
				toast.success(tRoot("saved"));
				onDefaultChange();
			} else {
				toast.error(tErrors("default"));
			}
		} finally {
			setBusy(false);
		}
	};

	return (
		<>
			<PanelHeader
				method="CASH_AT_ENTRANCE"
				isEnabled={isEnabled}
				onToggle={handleToggle}
				busy={busy}
			/>
			<form onSubmit={saveData} className="p-4 flex flex-col gap-4">
				<Controller
					control={form.control}
					name="instructions"
					render={({ field, fieldState }) => (
						<InstructionsField
							label={t("paymentInstructions")}
							optional={t("optional")}
							value={field.value ?? ""}
							onChange={field.onChange}
							placeholder={t("cashInstructionsPlaceholder")}
							hint={t("paymentInstructionsHint")}
							error={fieldState.error?.message}
						/>
					)}
				/>
				<FormFooter
					onSave={saveData}
					onCancel={() => form.reset()}
					onSetDefault={!isDefault && isEnabled ? handleSetDefault : undefined}
					isSubmitting={form.formState.isSubmitting || busy}
				/>
			</form>
		</>
	);
}

// ── FREE ───────────────────────────────────────────────────────────────────────

function FreePanel({
	organizationId,
	initialData,
}: {
	organizationId: string;
	initialData: { instructions: string | null };
}) {
	const t = useTranslations("OrganizationSettings.payment");
	const tErrors = useTranslations("OrganizationSettings.payment.errors");
	const tRoot = useTranslations("OrganizationSettings");

	const schema = z.object({
		instructions: z
			.string()
			.trim()
			.max(2000, tErrors("max2000"))
			.optional()
			.transform((v) => (v === "" ? null : (v ?? null))),
	});

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: { instructions: initialData.instructions ?? "" },
	});

	const saveData = form.handleSubmit(async (data) => {
		const result = await updatePaymentMethodAction({
			organizationId,
			method: "FREE",
			instructions: data.instructions ?? null,
		});
		if (!result.success) {
			toast.error(tErrors("default"));
			return;
		}
		toast.success(tRoot("saved"));
	});

	return (
		<>
			<PanelHeader method="FREE" isEnabled={false} />
			<form onSubmit={saveData} className="p-4 flex flex-col gap-4">
				<Controller
					control={form.control}
					name="instructions"
					render={({ field, fieldState }) => (
						<InstructionsField
							label={t("freeInstructionsLabel")}
							optional={t("optional")}
							value={field.value ?? ""}
							onChange={field.onChange}
							placeholder={t("freeInstructionsPlaceholder")}
							hint={t("paymentInstructionsHint")}
							error={fieldState.error?.message}
						/>
					)}
				/>
				<FormFooter
					onSave={saveData}
					onCancel={() => form.reset()}
					isSubmitting={form.formState.isSubmitting}
				/>
			</form>
		</>
	);
}

// ── Main component ─────────────────────────────────────────────────────────────

export function OrganizationPaymentForm({ organizationId, initialData }: Props) {
	const t = useTranslations("OrganizationSettings.payment");

	const [enabledMethods, setEnabledMethods] = useState<PaymentMethod[]>(
		initialData.enabledPaymentMethods,
	);
	const [defaultMethod, setDefaultMethod] = useState<PaymentMethod | null>(
		initialData.defaultPaymentMethod,
	);
	const [selectedTab, setSelectedTab] = useState<PaymentMethod>(
		initialData.defaultPaymentMethod ?? "BANK_TRANSFER",
	);

	const isEnabled = (m: PaymentMethod) =>
		m === "FREE" ? true : enabledMethods.includes(m);

	const getStatus = (m: PaymentMethod) => {
		if (m === "FREE") return t("auto");
		if (defaultMethod === m) return t("activeDefault");
		if (enabledMethods.includes(m)) return t("active");
		return t("disabled");
	};

	const handleEnabledChange = (method: PaymentMethod, enabled: boolean) => {
		setEnabledMethods((prev) =>
			enabled ? [...new Set([...prev, method])] : prev.filter((m) => m !== method),
		);
		if (!enabled && defaultMethod === method) setDefaultMethod(null);
	};

	const handleDefaultChange = (method: PaymentMethod) => {
		setDefaultMethod(method);
		if (!enabledMethods.includes(method)) {
			setEnabledMethods((prev) => [...new Set([...prev, method])]);
		}
	};

	const activeCount = enabledMethods.length;

	return (
		<div className="flex flex-col gap-3">
			{/* Tab bar */}
			<div className="flex items-center justify-between mb-1">
				{activeCount > 0 && (
					<span className="text-xs text-muted-foreground ml-auto">
						{t("activeCount", { count: activeCount })}
					</span>
				)}
			</div>

			<div className="grid grid-cols-2 md:grid-cols-4 gap-2">
				{METHODS.map((method) => {
					const Icon = METHOD_ICONS[method];
					const isSelected = selectedTab === method;
					const methodEnabled = isEnabled(method);
					const status = getStatus(method);
					const isMethodDefault = defaultMethod === method;

					return (
						<button
							key={method}
							type="button"
							onClick={() => setSelectedTab(method)}
							className={cn(
								"flex items-start gap-2.5 p-3 rounded-lg border text-left transition-colors",
								isSelected
									? "border-primary bg-primary/5"
									: "border-border bg-background hover:bg-muted/40",
							)}
						>
							<Icon
								className={cn(
									"size-4 mt-0.5 shrink-0",
									isSelected
										? "text-primary"
										: "text-muted-foreground",
								)}
							/>
							<div className="min-w-0">
								<p
									className={cn(
										"text-sm font-medium leading-tight truncate",
										isSelected && "text-primary",
									)}
								>
									{t(`methods.${method}`)}
								</p>
								<p
									className={cn(
										"text-xs mt-0.5 truncate",
										isMethodDefault
											? "text-primary"
											: methodEnabled
												? "text-foreground/60"
												: "text-muted-foreground",
									)}
								>
									{status}
								</p>
							</div>
						</button>
					);
				})}
			</div>

			{/* Panel */}
			<div className="border rounded-lg overflow-hidden">
				{selectedTab === "BANK_TRANSFER" && (
					<BankTransferPanel
						organizationId={organizationId}
						isEnabled={isEnabled("BANK_TRANSFER")}
						isDefault={defaultMethod === "BANK_TRANSFER"}
						initialData={{
							bankAccountNumber: initialData.bankAccountNumber,
							bankAccountHolder: initialData.bankAccountHolder,
							bankName: initialData.bankName,
							instructions: initialData.bankTransferInstructions,
						}}
						onEnabledChange={(e) =>
							handleEnabledChange("BANK_TRANSFER", e)
						}
						onDefaultChange={() =>
							handleDefaultChange("BANK_TRANSFER")
						}
					/>
				)}
				{selectedTab === "EXTERNAL_LINK" && (
					<ExternalLinkPanel
						organizationId={organizationId}
						isEnabled={isEnabled("EXTERNAL_LINK")}
						isDefault={defaultMethod === "EXTERNAL_LINK"}
						initialData={{
							paymentLink: initialData.paymentLink,
							instructions: initialData.externalLinkInstructions,
						}}
						onEnabledChange={(e) =>
							handleEnabledChange("EXTERNAL_LINK", e)
						}
						onDefaultChange={() =>
							handleDefaultChange("EXTERNAL_LINK")
						}
					/>
				)}
				{selectedTab === "CASH_AT_ENTRANCE" && (
					<CashAtEntrancePanel
						organizationId={organizationId}
						isEnabled={isEnabled("CASH_AT_ENTRANCE")}
						isDefault={defaultMethod === "CASH_AT_ENTRANCE"}
						initialData={{
							instructions: initialData.cashAtEntranceInstructions,
						}}
						onEnabledChange={(e) =>
							handleEnabledChange("CASH_AT_ENTRANCE", e)
						}
						onDefaultChange={() =>
							handleDefaultChange("CASH_AT_ENTRANCE")
						}
					/>
				)}
				{selectedTab === "FREE" && (
					<FreePanel
						organizationId={organizationId}
						initialData={{
							instructions: initialData.freeInstructions,
						}}
					/>
				)}
			</div>
		</div>
	);
}
