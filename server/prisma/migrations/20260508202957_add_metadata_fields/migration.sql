-- AlterTable
ALTER TABLE "Salary" ADD COLUMN     "compensationPeriod" TEXT NOT NULL DEFAULT 'YEARLY',
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'INR';
