/*
  Warnings:

  - A unique constraint covering the columns `[projectId,personId]` on the table `project_member` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "project_member_personId_projectId_key";

-- AlterTable
ALTER TABLE "report_project" ADD COLUMN     "isDraft" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "project_member_projectId_personId_key" ON "project_member"("projectId", "personId");
