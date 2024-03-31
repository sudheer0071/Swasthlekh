/*
  Warnings:

  - You are about to drop the column `doctor` on the `Logs` table. All the data in the column will be lost.
  - Added the required column `doctorId` to the `Logs` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Logs_doctor_key";

-- AlterTable
ALTER TABLE "Logs" DROP COLUMN "doctor",
ADD COLUMN     "doctorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
