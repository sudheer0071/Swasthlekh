/*
  Warnings:

  - You are about to drop the column `logsId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `Logs` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_logsId_fkey";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "logsId";

-- AlterTable
ALTER TABLE "Logs" DROP COLUMN "user";

-- CreateTable
CREATE TABLE "AccessedFiles" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "logsId" INTEGER,

    CONSTRAINT "AccessedFiles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AccessedFiles" ADD CONSTRAINT "AccessedFiles_logsId_fkey" FOREIGN KEY ("logsId") REFERENCES "Logs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
