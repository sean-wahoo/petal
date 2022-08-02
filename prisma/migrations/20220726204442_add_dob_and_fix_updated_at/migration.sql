-- AlterTable
ALTER TABLE `Comment` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `CommentRate` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Friend` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Post` MODIFY `isEdited` BIT(1) NOT NULL DEFAULT false,
    ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `PostRate` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `dateOfBirth` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ALTER COLUMN `updatedAt` DROP DEFAULT;
