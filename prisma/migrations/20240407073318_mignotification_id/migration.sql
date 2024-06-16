-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_notificationId_fkey";

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "notificationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Like" ALTER COLUMN "notificationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE SET NULL ON UPDATE CASCADE;
