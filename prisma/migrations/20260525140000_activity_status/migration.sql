-- CreateEnum
CREATE TYPE "ActivityStatus" AS ENUM ('ONLINE', 'OFFLINE', 'AWAY', 'DND');

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN "lastActiveAt" TIMESTAMP(3),
ADD COLUMN "status" "ActivityStatus",
ADD COLUMN "statusExpiresAt" TIMESTAMP(3);
