/*
  Warnings:

  - A unique constraint covering the columns `[doctor]` on the table `Logs` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Logs_doctor_key" ON "Logs"("doctor");
