/*
  Warnings:

  - You are about to drop the column `filepath` on the `File` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "File_filepath_key";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "filepath";
