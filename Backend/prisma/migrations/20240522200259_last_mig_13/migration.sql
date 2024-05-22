/*
  Warnings:

  - A unique constraint covering the columns `[user,doctor]` on the table `AccessReport` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `doctorId` to the `Hospital` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hospital" ADD COLUMN     "doctorId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AccessReport_user_doctor_key" ON "AccessReport"("user", "doctor");

-- AddForeignKey
ALTER TABLE "Hospital" ADD CONSTRAINT "Hospital_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
