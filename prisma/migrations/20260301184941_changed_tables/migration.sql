/*
  Warnings:

  - The values [PL,US,UK,UA,DE,FR,IT,ES,CA,AU,NZ] on the enum `Country` will be removed. If these variants are still used in the database, this will fail.
  - The `country` column on the `addresses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `organizationId` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'CANCELLED');

-- AlterEnum
BEGIN;
CREATE TYPE "Country_new" AS ENUM ('COUNTRY_PL', 'COUNTRY_US', 'COUNTRY_UK', 'COUNTRY_UA', 'COUNTRY_DE', 'COUNTRY_FR', 'COUNTRY_IT', 'COUNTRY_ES', 'COUNTRY_CA', 'COUNTRY_AU', 'COUNTRY_NZ');

-- Сначала убираем дефолт
ALTER TABLE "addresses" ALTER COLUMN "country" DROP DEFAULT;

-- Конвертируем тип
ALTER TABLE "addresses" ALTER COLUMN "country" TYPE "Country_new" 
  USING ("country"::text::"Country_new");

ALTER TYPE "Country" RENAME TO "Country_old";
ALTER TYPE "Country_new" RENAME TO "Country";
DROP TYPE "Country_old";

-- Возвращаем дефолт
ALTER TABLE "addresses" ALTER COLUMN "country" SET DEFAULT 'COUNTRY_PL'::"Country";
COMMIT;

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_organizationId_fkey";

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "organizationId";

-- CreateTable
CREATE TABLE "event_categories" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT,
    "parent_id" TEXT,

    CONSTRAINT "event_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_categories_on_events" (
    "event_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "event_categories_on_events_pkey" PRIMARY KEY ("event_id","category_id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "user_id" TEXT,
    "email" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "total" INTEGER NOT NULL DEFAULT 0,
    "currency" "Currency" NOT NULL DEFAULT 'PLN',
    "buyer_name" TEXT,
    "buyer_surname" TEXT,
    "buyer_phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "ticket_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participants" (
    "id" TEXT NOT NULL,
    "order_item_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "check_in_code" TEXT NOT NULL,
    "checked_in_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "order_id" TEXT NOT NULL,
    "provider" TEXT,
    "provider_payment_id" TEXT,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "currency" "Currency" NOT NULL DEFAULT 'PLN',
    "status" "PaymentStatus" NOT NULL DEFAULT 'CREATED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refunds" (
    "id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'PLN',
    "reason" TEXT,
    "status" "RefundStatus" NOT NULL DEFAULT 'PENDING',
    "provider_refund_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refunds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_categories_name_key" ON "event_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "event_categories_slug_key" ON "event_categories"("slug");

-- CreateIndex
CREATE INDEX "idx_event_categories_parent_id" ON "event_categories"("parent_id");

-- CreateIndex
CREATE INDEX "idx_event_category_on_event_category_id" ON "event_categories_on_events"("category_id");

-- CreateIndex
CREATE INDEX "idx_tickets_event_id" ON "tickets"("event_id");

-- CreateIndex
CREATE INDEX "idx_orders_event_id" ON "orders"("event_id");

-- CreateIndex
CREATE INDEX "idx_orders_user_id" ON "orders"("user_id");

-- CreateIndex
CREATE INDEX "idx_orders_status" ON "orders"("status");

-- CreateIndex
CREATE INDEX "idx_order_item_ticket_id" ON "order_items"("ticket_id");

-- CreateIndex
CREATE INDEX "idx_order_item_order_id" ON "order_items"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "participants_check_in_code_key" ON "participants"("check_in_code");

-- CreateIndex
CREATE INDEX "idx_attendees_order_item_id" ON "participants"("order_item_id");

-- CreateIndex
CREATE INDEX "idx_attendees_check_in_code" ON "participants"("check_in_code");

-- CreateIndex
CREATE UNIQUE INDEX "payments_provider_payment_id_key" ON "payments"("provider_payment_id");

-- CreateIndex
CREATE INDEX "idx_payments_order_id" ON "payments"("order_id");

-- CreateIndex
CREATE INDEX "idx_payments_status" ON "payments"("status");

-- CreateIndex
CREATE INDEX "idx_payments_user_id" ON "payments"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "refunds_provider_refund_id_key" ON "refunds"("provider_refund_id");

-- CreateIndex
CREATE INDEX "idx_refunds_payment_id" ON "refunds"("payment_id");

-- CreateIndex
CREATE INDEX "idx_events_organization_id" ON "events"("organization_id");

-- CreateIndex
CREATE INDEX "idx_events_status" ON "events"("status");

-- AddForeignKey
ALTER TABLE "event_categories" ADD CONSTRAINT "event_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "event_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_categories_on_events" ADD CONSTRAINT "event_categories_on_events_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_categories_on_events" ADD CONSTRAINT "event_categories_on_events_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "event_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
