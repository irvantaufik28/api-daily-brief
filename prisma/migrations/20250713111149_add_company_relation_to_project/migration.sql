/*
  Warnings:

  - You are about to drop the column `altEmail1` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `altEmail2` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `altEmail3` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `projectOwner` on the `project` table. All the data in the column will be lost.
  - Added the required column `companyId` to the `project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "project" DROP COLUMN "altEmail1",
DROP COLUMN "altEmail2",
DROP COLUMN "altEmail3",
DROP COLUMN "email",
DROP COLUMN "location",
DROP COLUMN "phone",
DROP COLUMN "projectOwner",
ADD COLUMN     "companyId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "company" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "altEmail1" TEXT,
    "altEmail2" TEXT,
    "altEmail3" TEXT,
    "phone" TEXT,
    "location" TEXT,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
