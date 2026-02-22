/*
  Warnings:

  - You are about to drop the column `createdAt` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `organizations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nip]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[regon]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[krs]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `organizations` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Country" AS ENUM ('PL', 'US', 'UK', 'UA', 'DE', 'FR', 'IT', 'ES', 'CA', 'AU', 'NZ');

-- CreateEnum
CREATE TYPE "VatStatus" AS ENUM ('ACTIVE', 'EXEMPT', 'UNREGISTERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EmployeeCountRange" AS ENUM ('MICRO', 'SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('REGISTERED', 'BILLING', 'SHIPPING', 'BRANCH', 'CORRESPONDENCE');

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "organizationId" TEXT;

-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "createdAt",
DROP COLUMN "name",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "employeeCountRange" "EmployeeCountRange",
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "krs" TEXT,
ADD COLUMN     "ksefEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "legalForm" TEXT,
ADD COLUMN     "legalFormCode" TEXT,
ADD COLUMN     "mainPkdCode" TEXT,
ADD COLUMN     "nip" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "regon" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vatId" TEXT,
ADD COLUMN     "vatStatus" "VatStatus" DEFAULT 'ACTIVE',
ADD COLUMN     "website" TEXT;

-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "type" "AddressType" NOT NULL,
    "street" TEXT NOT NULL,
    "buildingNumber" TEXT NOT NULL,
    "apartmentNumber" TEXT,
    "zipCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "voivodeship" TEXT,
    "country" TEXT NOT NULL DEFAULT 'PL',
    "organizationId" TEXT,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_members" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "member_role" "MemberRole" NOT NULL DEFAULT 'OWNER',

    CONSTRAINT "organization_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organization_members_user_id_key" ON "organization_members"("user_id");

-- CreateIndex
CREATE INDEX "idx_organization_members_user_id" ON "organization_members"("user_id");

-- CreateIndex
CREATE INDEX "idx_organization_members_organization_id" ON "organization_members"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_nip_key" ON "organizations"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_regon_key" ON "organizations"("regon");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_krs_key" ON "organizations"("krs");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
