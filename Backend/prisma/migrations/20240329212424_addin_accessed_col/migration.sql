/*
  Warnings:

  - Added the required column `accesed` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "accesed" TIMESTAMP(3) NOT NULL;
