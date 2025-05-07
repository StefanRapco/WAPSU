-- AlterTable
ALTER TABLE `Team` ADD COLUMN `description` TEXT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `systemRole` ENUM('admin', 'user') NOT NULL DEFAULT 'user';

-- AlterTable
ALTER TABLE `UserOnTeam` ADD COLUMN `teamRole` ENUM('owner', 'ambassador', 'member') NOT NULL DEFAULT 'member';
