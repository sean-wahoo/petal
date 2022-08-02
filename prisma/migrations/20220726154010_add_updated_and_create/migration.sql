-- AlterTable
ALTER TABLE `Post` MODIFY `isEdited` BIT(1) NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);
