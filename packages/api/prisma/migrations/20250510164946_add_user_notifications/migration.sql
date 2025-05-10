-- AlterTable
ALTER TABLE `User` ADD COLUMN `individualNotifications` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `teamNotifications` BOOLEAN NOT NULL DEFAULT true;
