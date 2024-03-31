/*
  Warnings:

  - The primary key for the `Logs` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "AccessedFiles" DROP CONSTRAINT "AccessedFiles_logsId_fkey";

-- AlterTable
ALTER TABLE "AccessedFiles" ALTER COLUMN "logsId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Logs" DROP CONSTRAINT "Logs_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Logs_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Logs_id_seq";

-- AddForeignKey
ALTER TABLE "AccessedFiles" ADD CONSTRAINT "AccessedFiles_logsId_fkey" FOREIGN KEY ("logsId") REFERENCES "Logs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
