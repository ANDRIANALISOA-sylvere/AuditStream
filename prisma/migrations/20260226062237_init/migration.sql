-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('INSERT', 'UPDATE', 'DELETE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "numero_compte" TEXT NOT NULL,
    "nom_client" TEXT NOT NULL,
    "solde" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("numero_compte")
);

-- CreateTable
CREATE TABLE "Versement" (
    "numero_versement" SERIAL NOT NULL,
    "numero_cheque" TEXT NOT NULL,
    "montant" DECIMAL(65,30) NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Versement_pkey" PRIMARY KEY ("numero_versement")
);

-- CreateTable
CREATE TABLE "Audit_Versement" (
    "id" SERIAL NOT NULL,
    "type_action" "ActionType" NOT NULL,
    "date_operation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "versementId" INTEGER,
    "numero_compte" TEXT,
    "nom_client" TEXT NOT NULL,
    "montant_ancien" DECIMAL(65,30),
    "montant_nouveau" DECIMAL(65,30),
    "utilisateurId" INTEGER,

    CONSTRAINT "Audit_Versement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Versement" ADD CONSTRAINT "Versement_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("numero_compte") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audit_Versement" ADD CONSTRAINT "Audit_Versement_versementId_fkey" FOREIGN KEY ("versementId") REFERENCES "Versement"("numero_versement") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audit_Versement" ADD CONSTRAINT "Audit_Versement_numero_compte_fkey" FOREIGN KEY ("numero_compte") REFERENCES "Client"("numero_compte") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audit_Versement" ADD CONSTRAINT "Audit_Versement_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
