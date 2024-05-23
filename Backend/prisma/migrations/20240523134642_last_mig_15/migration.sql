/*
  Warnings:

  - You are about to drop the `Requests` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "AccessReport" ADD COLUMN     "grant" BOOLEAN;

-- DropTable
DROP TABLE "Requests";
