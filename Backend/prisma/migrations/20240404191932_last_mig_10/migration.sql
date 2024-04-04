/*
  Warnings:

  - A unique constraint covering the columns `[doctor]` on the table `AccessReport` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AccessReport_doctor_key" ON "AccessReport"("doctor");
