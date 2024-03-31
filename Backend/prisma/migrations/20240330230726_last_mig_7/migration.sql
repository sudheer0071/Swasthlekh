/*
  Warnings:

  - You are about to drop the column `doctorId` on the `Logs` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[doctorEmail,userEmail]` on the table `Logs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `actions` to the `AccessedFiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctorEmail` to the `Logs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Logs" DROP CONSTRAINT "Logs_doctorId_fkey";

-- DropIndex
DROP INDEX "Logs_doctorId_userEmail_key";

-- AlterTable
ALTER TABLE "AccessedFiles" ADD COLUMN     "actions" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Logs" DROP COLUMN "doctorId",
ADD COLUMN     "doctorEmail" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Logs_doctorEmail_userEmail_key" ON "Logs"("doctorEmail", "userEmail");

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_doctorEmail_fkey" FOREIGN KEY ("doctorEmail") REFERENCES "Doctor"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
