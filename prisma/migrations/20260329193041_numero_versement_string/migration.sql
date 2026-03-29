/*
  Warnings:

  - The primary key for the `Versement` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Audit_Versement" DROP CONSTRAINT "Audit_Versement_versementId_fkey";

-- AlterTable
ALTER TABLE "Audit_Versement" ALTER COLUMN "versementId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Versement" DROP CONSTRAINT "Versement_pkey",
ALTER COLUMN "numero_versement" DROP DEFAULT,
ALTER COLUMN "numero_versement" SET DATA TYPE TEXT,
ADD CONSTRAINT "Versement_pkey" PRIMARY KEY ("numero_versement");
DROP SEQUENCE "Versement_numero_versement_seq";

-- AddForeignKey
ALTER TABLE "Audit_Versement" ADD CONSTRAINT "Audit_Versement_versementId_fkey" FOREIGN KEY ("versementId") REFERENCES "Versement"("numero_versement") ON DELETE SET NULL ON UPDATE CASCADE;
