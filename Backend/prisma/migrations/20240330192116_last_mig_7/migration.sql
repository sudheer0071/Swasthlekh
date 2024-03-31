-- DropForeignKey
ALTER TABLE "Logs" DROP CONSTRAINT "Logs_userEmail_fkey";

-- AlterTable
ALTER TABLE "Logs" ALTER COLUMN "userEmail" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;
