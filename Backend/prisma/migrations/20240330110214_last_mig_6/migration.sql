/*
  Warnings:

  - You are about to drop the column `date` on the `Logs` table. All the data in the column will be lost.
  - Added the required column `date` to the `AccessedFiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccessedFiles" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Logs" DROP COLUMN "date";
