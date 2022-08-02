/*
  Warnings:

  - The primary key for the `CommentRate` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PostRate` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TopicUserRelationship` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_authorUserId_fkey`;

-- DropForeignKey
ALTER TABLE `CommentRate` DROP FOREIGN KEY `CommentRate_userRateId_fkey`;

-- DropForeignKey
ALTER TABLE `Friend` DROP FOREIGN KEY `Friend_recipientUserId_fkey`;

-- DropForeignKey
ALTER TABLE `Friend` DROP FOREIGN KEY `Friend_senderUserId_fkey`;

-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_authorUserId_fkey`;

-- DropForeignKey
ALTER TABLE `PostRate` DROP FOREIGN KEY `PostRate_userRateId_fkey`;

-- DropForeignKey
ALTER TABLE `TopicUserRelationship` DROP FOREIGN KEY `TopicUserRelationship_userId_fkey`;

-- AlterTable
ALTER TABLE `Comment` MODIFY `authorUserId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `CommentRate` DROP PRIMARY KEY,
    MODIFY `userRateId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`userRateId`, `commentRateId`);

-- AlterTable
ALTER TABLE `Friend` MODIFY `senderUserId` VARCHAR(191) NOT NULL,
    MODIFY `recipientUserId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Post` MODIFY `authorUserId` VARCHAR(191) NOT NULL,
    MODIFY `isEdited` BIT(1) NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `PostRate` DROP PRIMARY KEY,
    MODIFY `userRateId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`userRateId`, `postRateId`);

-- AlterTable
ALTER TABLE `TopicUserRelationship` DROP PRIMARY KEY,
    MODIFY `userId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`userId`, `topicId`);

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_authorUserId_fkey` FOREIGN KEY (`authorUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_authorUserId_fkey` FOREIGN KEY (`authorUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friend` ADD CONSTRAINT `Friend_senderUserId_fkey` FOREIGN KEY (`senderUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friend` ADD CONSTRAINT `Friend_recipientUserId_fkey` FOREIGN KEY (`recipientUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostRate` ADD CONSTRAINT `PostRate_userRateId_fkey` FOREIGN KEY (`userRateId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentRate` ADD CONSTRAINT `CommentRate_userRateId_fkey` FOREIGN KEY (`userRateId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TopicUserRelationship` ADD CONSTRAINT `TopicUserRelationship_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
