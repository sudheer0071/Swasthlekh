/*
  Warnings:

  - A unique constraint covering the columns `[userEmail]` on the table `Logs` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Logs_userEmail_key" ON "Logs"("userEmail");
