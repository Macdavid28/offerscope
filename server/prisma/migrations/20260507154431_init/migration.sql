/*
  Warnings:

  - The primary key for the `Salary` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `Salary` table. All the data in the column will be lost.
  - You are about to drop the column `isLoggedIn` on the `Salary` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Salary` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Salary` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNo` on the `Salary` table. All the data in the column will be lost.
  - Added the required column `baseSalary` to the `Salary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company` to the `Salary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `confidenceScore` to the `Salary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experienceYears` to the `Salary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `Salary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `levelStandardized` to the `Salary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Salary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Salary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCompensation` to the `Salary` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Salary_email_key";

-- DropIndex
DROP INDEX "Salary_phoneNo_key";

-- AlterTable
ALTER TABLE "Salary" DROP CONSTRAINT "Salary_pkey",
DROP COLUMN "email",
DROP COLUMN "isLoggedIn",
DROP COLUMN "name",
DROP COLUMN "password",
DROP COLUMN "phoneNo",
ADD COLUMN     "baseSalary" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "bonus" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "company" TEXT NOT NULL,
ADD COLUMN     "confidenceScore" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "experienceYears" INTEGER NOT NULL,
ADD COLUMN     "level" TEXT NOT NULL,
ADD COLUMN     "levelStandardized" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL,
ADD COLUMN     "stock" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalCompensation" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Salary_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Salary_id_seq";

-- CreateIndex
CREATE INDEX "Salary_company_idx" ON "Salary"("company");

-- CreateIndex
CREATE INDEX "Salary_level_idx" ON "Salary"("level");

-- CreateIndex
CREATE INDEX "Salary_totalCompensation_idx" ON "Salary"("totalCompensation");
