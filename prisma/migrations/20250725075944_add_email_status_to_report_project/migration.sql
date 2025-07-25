-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'FAILED', 'SENDING');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "report_project" ADD COLUMN     "emailStatus" "EmailStatus" NOT NULL DEFAULT 'PENDING';
