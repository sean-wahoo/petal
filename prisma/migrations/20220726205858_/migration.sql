-- AlterTable
ALTER TABLE `Post` MODIFY `isEdited` BIT(1) NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `description` TEXT NULL,
    MODIFY `dateOfBirth` TIMESTAMP(0) NULL;
