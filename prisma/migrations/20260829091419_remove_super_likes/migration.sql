/*
  Warnings:

  - You are about to drop the column `language` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `superLikes` on the `UserSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserSettings" DROP COLUMN "language",
DROP COLUMN "phone",
DROP COLUMN "superLikes";
