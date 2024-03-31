/*
  Warnings:

  - You are about to drop the column `date` on the `AccessedFiles` table. All the data in the column will be lost.
  - The `logsId` column on the `AccessedFiles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Logs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `doctorId` on the `Logs` table. All the data in the column will be lost.
  - The `id` column on the `Logs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `doctor` to the `AccessedFiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Logs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AccessedFiles" DROP CONSTRAINT "AccessedFiles_logsId_fkey";

-- DropForeignKey
ALTER TABLE "Logs" DROP CONSTRAINT "Logs_doctorId_fkey";

-- AlterTable
ALTER TABLE "AccessedFiles" DROP COLUMN "date",
ADD COLUMN     "doctor" TEXT NOT NULL,
DROP COLUMN "logsId",
ADD COLUMN     "logsId" INTEGER;

-- AlterTable
ALTER TABLE "Logs" DROP CONSTRAINT "Logs_pkey",
DROP COLUMN "doctorId",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Logs_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "AccessedFiles" ADD CONSTRAINT "AccessedFiles_logsId_fkey" FOREIGN KEY ("logsId") REFERENCES "Logs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
