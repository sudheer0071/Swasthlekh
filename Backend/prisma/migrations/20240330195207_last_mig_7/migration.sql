/*
  Warnings:

  - Made the column `userEmail` on table `Logs` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Logs" DROP CONSTRAINT "Logs_userEmail_fkey";

-- DropIndex
DROP INDEX "Logs_userEmail_key";

-- AlterTable
ALTER TABLE "Logs" ALTER COLUMN "userEmail" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
