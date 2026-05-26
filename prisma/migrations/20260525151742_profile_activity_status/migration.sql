/*
  Warnings:

  - You are about to drop the column `isPublic` on the `Desk` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DeskVisibility" AS ENUM ('PUBLIC', 'PRIVATE', 'SCHOOL', 'RESTRICTED');

-- AlterTable
ALTER TABLE "Desk" DROP COLUMN "isPublic",
ADD COLUMN     "visibility" "DeskVisibility" NOT NULL DEFAULT 'SCHOOL';
