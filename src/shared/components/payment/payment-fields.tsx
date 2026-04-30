"use client";

import { PaymentMethod } from "@prisma/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, FieldError } from "@/components/ui/field";
import { formatIban } from "@/lib/payment/iban";

type Translations = {
	method: string;
	methods: Record<string, string>;
	methodHints: Record<string, string>;
	bankAccountNumber: string;
	bankAccountNumberPlaceholder: string;
	bankAccountHolder: string;
	bankAccountHolderPlaceholder: string;
	paymentLink: string;
	paymentLinkPlaceholder: string;
	paymentInstructions: string;
	paymentInstructionsPlaceholder: string;
	paymentInstructionsHint: string;
};

type Props = {
	t: Translations;
	method: PaymentMethod | null | undefined;
	onMethodChange: (v: PaymentMethod | null) => void;
	methodError?: string;
	bankAccountNumber: string | null | undefined;
	onBankAccountNumberChange: (v: string) => void;
	bankAccountNumberError?: string;
	bankAccountHolder: string | null | undefined;
	onBankAccountHolderChange: (v: string) => void;
	bankAccountHolderError?: string;
	paymentLink: string | null | undefined;
	onPaymentLinkChange: (v: string) => void;
	paymentLinkError?: string;
	paymentInstructions: string | null | undefined;
	onPaymentInstructionsChange: (v: string) => void;
	paymentInstructionsError?: string;
	showFreeOption?: boolean;
};

const METHODS: PaymentMethod[] = [
	"BANK_TRANSFER",
	"EXTERNAL_LINK",
	"CASH_AT_ENTRANCE",
];

export function PaymentFields({
	t,
	method,
	onMethodChange,
	methodError,
	bankAccountNumber,
	onBankAccountNumberChange,
	bankAccountNumberError,
	bankAccountHolder,
	onBankAccountHolderChange,
	bankAccountHolderError,
	paymentLink,
	onPaymentLinkChange,
	paymentLinkError,
	paymentInstructions,
	onPaymentInstructionsChange,
	paymentInstructionsError,
	showFreeOption = false,
}: Props) {
	const methods: PaymentMethod[] = showFreeOption
		? [...METHODS, "FREE"]
		: METHODS;

	return (
		<div className="flex flex-col gap-4">
			<Field>
				<Label className="text-sm font-medium">{t.method}</Label>
				<RadioGroup
					value={method ?? ""}
					onValueChange={(v) =>
						onMethodChange(v ? (v as PaymentMethod) : null)
					}
					className="flex flex-col gap-2 mt-1"
				>
					{methods.map((m) => (
						<label
							key={m}
							className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
						>
							<RadioGroupItem value={m} className="mt-0.5" />
							<div className="flex flex-col gap-0.5">
								<span className="text-sm font-medium">
									{t.methods[m]}
								</span>
								<span className="text-xs text-muted-foreground">
									{t.methodHints[m]}
								</span>
							</div>
						</label>
					))}
				</RadioGroup>
				{methodError && <FieldError>{methodError}</FieldError>}
			</Field>

			{method === "BANK_TRANSFER" && (
				<>
					<Field>
						<Label className="text-sm font-medium">
							{t.bankAccountNumber}
						</Label>
						<Input
							value={bankAccountNumber ?? ""}
							onChange={(e) =>
								onBankAccountNumberChange(e.target.value)
							}
							onBlur={(e) => {
								const raw = e.target.value;
								if (raw) onBankAccountNumberChange(formatIban(raw));
							}}
							placeholder={t.bankAccountNumberPlaceholder}
						/>
						{bankAccountNumberError && (
							<FieldError>{bankAccountNumberError}</FieldError>
						)}
					</Field>

					<Field>
						<Label className="text-sm font-medium">
							{t.bankAccountHolder}
						</Label>
						<Input
							value={bankAccountHolder ?? ""}
							onChange={(e) =>
								onBankAccountHolderChange(e.target.value)
							}
							placeholder={t.bankAccountHolderPlaceholder}
						/>
						{bankAccountHolderError && (
							<FieldError>{bankAccountHolderError}</FieldError>
						)}
					</Field>
				</>
			)}

			{method === "EXTERNAL_LINK" && (
				<Field>
					<Label className="text-sm font-medium">
						{t.paymentLink}
					</Label>
					<Input
						type="url"
						value={paymentLink ?? ""}
						onChange={(e) => onPaymentLinkChange(e.target.value)}
						placeholder={t.paymentLinkPlaceholder}
					/>
					{paymentLinkError && (
						<FieldError>{paymentLinkError}</FieldError>
					)}
				</Field>
			)}

			<Field>
				<Label className="text-sm font-medium">
					{t.paymentInstructions}
				</Label>
				<textarea
					className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
					value={paymentInstructions ?? ""}
					onChange={(e) =>
						onPaymentInstructionsChange(e.target.value)
					}
					placeholder={t.paymentInstructionsPlaceholder}
					maxLength={2000}
					rows={3}
				/>
				<p className="text-xs text-muted-foreground">
					{t.paymentInstructionsHint}
				</p>
				{paymentInstructionsError && (
					<FieldError>{paymentInstructionsError}</FieldError>
				)}
			</Field>
		</div>
	);
}
