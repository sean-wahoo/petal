-- AlterTable
ALTER TABLE `Post` MODIFY `isEdited` BIT(1) NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `beenWelcomed` BOOLEAN NOT NULL DEFAULT false;
