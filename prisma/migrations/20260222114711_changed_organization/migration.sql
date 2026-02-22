/*
  Warnings:

  - You are about to drop the column `ownerId` on the `organizations` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "organizations" DROP CONSTRAINT "organizations_ownerId_fkey";

-- DropIndex
DROP INDEX "organizations_ownerId_key";

-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "ownerId";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "organizationId" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
