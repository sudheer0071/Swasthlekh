/*
  Warnings:

  - You are about to drop the column `userId` on the `Logs` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Logs" DROP CONSTRAINT "Logs_userId_fkey";

-- AlterTable
ALTER TABLE "Logs" DROP COLUMN "userId",
ADD COLUMN     "userEmail" TEXT;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;
