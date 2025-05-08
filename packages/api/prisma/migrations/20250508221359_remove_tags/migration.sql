/*
  Warnings:

  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaskTagOnTask` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Tag` DROP FOREIGN KEY `Tag_teamId_fkey`;

-- DropForeignKey
ALTER TABLE `Tag` DROP FOREIGN KEY `Tag_userId_fkey`;

-- DropForeignKey
ALTER TABLE `TaskTagOnTask` DROP FOREIGN KEY `TaskTagOnTask_tagId_fkey`;

-- DropForeignKey
ALTER TABLE `TaskTagOnTask` DROP FOREIGN KEY `TaskTagOnTask_taskId_fkey`;

-- DropTable
DROP TABLE `Tag`;

-- DropTable
DROP TABLE `TaskTagOnTask`;
