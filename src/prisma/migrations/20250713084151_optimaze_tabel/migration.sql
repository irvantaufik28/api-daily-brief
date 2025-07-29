/*
  Warnings:

  - You are about to drop the column `content` on the `report_project` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `report_project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "report_project" DROP COLUMN "content",
DROP COLUMN "title",
ADD COLUMN     "reportDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "report_detail" (
    "id" SERIAL NOT NULL,
    "workedHour" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "reportProjectId" INTEGER NOT NULL,

    CONSTRAINT "report_detail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "report_detail" ADD CONSTRAINT "report_detail_reportProjectId_fkey" FOREIGN KEY ("reportProjectId") REFERENCES "report_project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
