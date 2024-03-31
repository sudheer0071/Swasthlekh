/*
  Warnings:

  - The primary key for the `Logs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `doctor` on the `Logs` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AccessedFiles" DROP CONSTRAINT "AccessedFiles_logId_fkey";

-- AlterTable
ALTER TABLE "AccessedFiles" ALTER COLUMN "logId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Logs" DROP CONSTRAINT "Logs_pkey",
DROP COLUMN "doctor",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Logs_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Logs_id_seq";

-- AddForeignKey
ALTER TABLE "AccessedFiles" ADD CONSTRAINT "AccessedFiles_logId_fkey" FOREIGN KEY ("logId") REFERENCES "Logs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
