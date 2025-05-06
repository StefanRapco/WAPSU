/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Team` table. All the data in the column will be lost.
  - Added the required column `avatar` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Team` DROP COLUMN `updatedAt`,
    ADD COLUMN `avatar` TINYTEXT NOT NULL;

-- AlterTable
ALTER TABLE `UserOnTeam` ADD COLUMN `isOwner` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
