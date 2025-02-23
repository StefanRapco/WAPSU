-- AlterTable
ALTER TABLE `User` ADD COLUMN `mfa` TINYTEXT NULL,
    MODIFY `password` TEXT NULL;
