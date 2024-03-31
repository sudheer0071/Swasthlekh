-- AlterTable
ALTER TABLE "File" ADD COLUMN     "logsId" INTEGER;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_logsId_fkey" FOREIGN KEY ("logsId") REFERENCES "Logs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
