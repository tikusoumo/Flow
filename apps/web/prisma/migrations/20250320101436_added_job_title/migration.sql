/*
  Warnings:

  - You are about to drop the column `UserId` on the `Workflow` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,name]` on the table `Workflow` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,definition]` on the table `Workflow` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Workflow` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Workflow_UserId_definition_key";

-- DropIndex
DROP INDEX "Workflow_UserId_name_key";

-- AlterTable
ALTER TABLE "Workflow" DROP COLUMN "UserId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Workflow_userId_name_key" ON "Workflow"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Workflow_userId_definition_key" ON "Workflow"("userId", "definition");
