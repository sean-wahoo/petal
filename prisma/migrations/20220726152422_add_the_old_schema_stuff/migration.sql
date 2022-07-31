-- CreateTable
CREATE TABLE `Post` (
    `postId` VARCHAR(24) NOT NULL,
    `authorUserId` VARCHAR(24) NOT NULL,
    `title` TEXT NOT NULL,
    `content` JSON NOT NULL,
    `isEdited` BIT(1) NOT NULL DEFAULT false,
    `ups` INTEGER NOT NULL DEFAULT 0,
    `downs` INTEGER NOT NULL DEFAULT 0,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`postId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `commentId` VARCHAR(24) NOT NULL,
    `authorUserId` VARCHAR(24) NOT NULL,
    `content` JSON NOT NULL,
    `parentId` VARCHAR(24) NOT NULL,
    `isReply` BIT(1) NOT NULL,
    `isEdited` BIT(1) NOT NULL,
    `ups` INTEGER NOT NULL,
    `downs` INTEGER NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`commentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Friend` (
    `friendId` VARCHAR(24) NOT NULL,
    `senderUserId` VARCHAR(24) NOT NULL,
    `recipientUserId` VARCHAR(24) NOT NULL,
    `status` VARCHAR(12) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `userId` VARCHAR(191) NULL,

    PRIMARY KEY (`friendId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Topic` (
    `topicId` VARCHAR(24) NOT NULL,
    `name` VARCHAR(52) NOT NULL,

    PRIMARY KEY (`topicId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PostRate` (
    `rateKind` VARCHAR(24) NOT NULL,
    `userRateId` VARCHAR(24) NOT NULL,
    `postRateId` VARCHAR(24) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`userRateId`, `postRateId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommentRate` (
    `rateKind` VARCHAR(24) NOT NULL,
    `userRateId` VARCHAR(24) NOT NULL,
    `commentRateId` VARCHAR(24) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`userRateId`, `commentRateId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TopicUserRelationship` (
    `userId` VARCHAR(24) NOT NULL,
    `topicId` VARCHAR(24) NOT NULL,
    `status` VARCHAR(24) NOT NULL DEFAULT 'joined',

    PRIMARY KEY (`userId`, `topicId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
ALTER TABLE `PostRate` ADD CONSTRAINT `PostRate_postRateId_fkey` FOREIGN KEY (`postRateId`) REFERENCES `Post`(`postId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentRate` ADD CONSTRAINT `CommentRate_userRateId_fkey` FOREIGN KEY (`userRateId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentRate` ADD CONSTRAINT `CommentRate_commentRateId_fkey` FOREIGN KEY (`commentRateId`) REFERENCES `Comment`(`commentId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TopicUserRelationship` ADD CONSTRAINT `TopicUserRelationship_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TopicUserRelationship` ADD CONSTRAINT `TopicUserRelationship_topicId_fkey` FOREIGN KEY (`topicId`) REFERENCES `Topic`(`topicId`) ON DELETE RESTRICT ON UPDATE CASCADE;
