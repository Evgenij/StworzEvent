-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('BANK_TRANSFER', 'EXTERNAL_LINK', 'CASH_AT_ENTRANCE', 'FREE');

-- AlterTable
ALTER TABLE "organizations"
ADD COLUMN "default_payment_method" "PaymentMethod",
ADD COLUMN "default_bank_account_number" TEXT,
ADD COLUMN "default_bank_account_holder" TEXT,
ADD COLUMN "default_payment_link" TEXT,
ADD COLUMN "default_payment_instructions" TEXT;

-- AlterTable
ALTER TABLE "events"
ADD COLUMN "payment_method" "PaymentMethod",
ADD COLUMN "bank_account_number" TEXT,
ADD COLUMN "bank_account_holder" TEXT,
ADD COLUMN "payment_link" TEXT,
ADD COLUMN "payment_instructions" TEXT;

-- AlterTable
ALTER TABLE "orders"
ADD COLUMN "payment_method" "PaymentMethod",
ADD COLUMN "payment_bank_account" TEXT,
ADD COLUMN "payment_bank_holder" TEXT,
ADD COLUMN "payment_link" TEXT,
ADD COLUMN "payment_instructions" TEXT,
ADD COLUMN "order_number" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_number_key" ON "orders"("order_number");
