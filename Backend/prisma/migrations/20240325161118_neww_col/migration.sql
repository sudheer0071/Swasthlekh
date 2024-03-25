/*
  Warnings:

  - A unique constraint covering the columns `[filepath]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `filepath` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "File_filename_key";

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "filepath" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "File_filepath_key" ON "File"("filepath");
