-- AlterTable: add enabled methods array and per-method instruction columns
ALTER TABLE "organizations"
ADD COLUMN "enabled_payment_methods" "PaymentMethod"[] NOT NULL DEFAULT '{}',
ADD COLUMN "bank_transfer_instructions"    TEXT,
ADD COLUMN "external_link_instructions"   TEXT,
ADD COLUMN "cash_at_entrance_instructions" TEXT,
ADD COLUMN "free_instructions"            TEXT;

-- Migrate existing defaultPaymentInstructions → bank_transfer_instructions
UPDATE "organizations"
SET "bank_transfer_instructions" = "default_payment_instructions"
WHERE "default_payment_method" = 'BANK_TRANSFER' AND "default_payment_instructions" IS NOT NULL;

-- Migrate current defaultPaymentMethod → enabledPaymentMethods
UPDATE "organizations"
SET "enabled_payment_methods" = ARRAY["default_payment_method"]
WHERE "default_payment_method" IS NOT NULL;
