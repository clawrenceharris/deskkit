-- DropForeignKey
ALTER TABLE "UserDesk" DROP CONSTRAINT "UserDesk_deskId_fkey";

-- DropForeignKey
ALTER TABLE "UserDesk" DROP CONSTRAINT "UserDesk_userId_fkey";

-- AlterTable
ALTER TABLE "Notebook" ADD COLUMN     "isLocked" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "UserDesk" ADD CONSTRAINT "UserDesk_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDesk" ADD CONSTRAINT "UserDesk_deskId_fkey" FOREIGN KEY ("deskId") REFERENCES "Desk"("id") ON DELETE CASCADE ON UPDATE CASCADE;
