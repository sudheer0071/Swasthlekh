/*
  Warnings:

  - A unique constraint covering the columns `[doctorId]` on the table `Logs` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Logs_doctorId_key" ON "Logs"("doctorId");
