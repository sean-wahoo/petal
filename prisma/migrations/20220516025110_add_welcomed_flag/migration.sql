-- AlterTable
ALTER TABLE `users` ADD COLUMN `been_welcomed` BIT(1) NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `topics` (
    `topic_id` VARCHAR(24) NOT NULL,
    `name` VARCHAR(52) NOT NULL,

    PRIMARY KEY (`topic_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `topic_user_relationships` (
    `user_id` VARCHAR(24) NOT NULL,
    `topic_id` VARCHAR(24) NOT NULL,
    `status` VARCHAR(24) NOT NULL DEFAULT 'joined',

    PRIMARY KEY (`user_id`, `topic_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `topic_user_relationships` ADD CONSTRAINT `topic_user_relationships_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `topic_user_relationships` ADD CONSTRAINT `topic_user_relationships_topic_id_fkey` FOREIGN KEY (`topic_id`) REFERENCES `topics`(`topic_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
