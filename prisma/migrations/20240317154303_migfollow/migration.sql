/*
  Warnings:

  - The primary key for the `FollowRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `followedById` on the `FollowRequest` table. All the data in the column will be lost.
  - You are about to drop the column `followingId` on the `FollowRequest` table. All the data in the column will be lost.
  - Added the required column `followedId` to the `FollowRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followerId` to the `FollowRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FollowRequest" DROP CONSTRAINT "FollowRequest_followedById_fkey";

-- DropForeignKey
ALTER TABLE "FollowRequest" DROP CONSTRAINT "FollowRequest_followingId_fkey";

-- AlterTable
ALTER TABLE "FollowRequest" DROP CONSTRAINT "FollowRequest_pkey",
DROP COLUMN "followedById",
DROP COLUMN "followingId",
ADD COLUMN     "followedId" INTEGER NOT NULL,
ADD COLUMN     "followerId" INTEGER NOT NULL,
ADD CONSTRAINT "FollowRequest_pkey" PRIMARY KEY ("followerId", "followedId");

-- AddForeignKey
ALTER TABLE "FollowRequest" ADD CONSTRAINT "FollowRequest_followedId_fkey" FOREIGN KEY ("followedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowRequest" ADD CONSTRAINT "FollowRequest_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
