/*
  Warnings:

  - The `legalForm` column on the `organizations` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "LegalForm" AS ENUM ('OSOBA_FIZYCZNA', 'JEDNOOSOBOWA_DG', 'SP_ZOO', 'SA', 'SP_JAWNA', 'SP_PARTNERSKA', 'SP_KOMANDYTOWA', 'SP_KOMANDYTOWO_AKCYJNA', 'STOWARZYSZENIE', 'FUNDACJA', 'SPOLDZIELNIA', 'INNE');

-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "legalForm",
ADD COLUMN     "legalForm" "LegalForm";
