-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Member_created_at_idx" ON "Member"("created_at");
