/*
  Warnings:

  - You are about to drop the column `doctor` on the `AccessedFiles` table. All the data in the column will be lost.
  - The primary key for the `Logs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date` on the `Logs` table. All the data in the column will be lost.
  - Added the required column `date` to the `AccessedFiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AccessedFiles" DROP CONSTRAINT "AccessedFiles_logsId_fkey";

-- AlterTable
ALTER TABLE "AccessedFiles" DROP COLUMN "doctor",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "logsId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Logs" DROP CONSTRAINT "Logs_pkey",
DROP COLUMN "date",
ADD COLUMN     "doctorId" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Logs_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Logs_id_seq";

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessedFiles" ADD CONSTRAINT "AccessedFiles_logsId_fkey" FOREIGN KEY ("logsId") REFERENCES "Logs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
