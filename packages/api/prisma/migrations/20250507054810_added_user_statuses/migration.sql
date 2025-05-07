-- AlterTable
ALTER TABLE `User` ADD COLUMN `status` ENUM('active', 'archived', 'invited') NOT NULL DEFAULT 'active';
