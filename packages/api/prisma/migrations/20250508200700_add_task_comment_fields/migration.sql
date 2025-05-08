/*
  Warnings:

  - Added the required column `authorId` to the `TaskComment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `TaskComment` ADD COLUMN `authorId` VARCHAR(48) NOT NULL;

-- AddForeignKey
ALTER TABLE `TaskComment` ADD CONSTRAINT `TaskComment_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
