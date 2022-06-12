/*
  Warnings:

  - You are about to drop the `likes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `likes` DROP FOREIGN KEY `likes_comment_like_id_fkey`;

-- DropForeignKey
ALTER TABLE `likes` DROP FOREIGN KEY `likes_post_like_id_fkey`;

-- DropForeignKey
ALTER TABLE `likes` DROP FOREIGN KEY `likes_user_like_id_fkey`;

-- AlterTable
ALTER TABLE `posts` MODIFY `is_edited` BIT(1) NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `users` MODIFY `been_welcomed` BIT(1) NOT NULL DEFAULT false;

-- DropTable
DROP TABLE `likes`;

-- CreateTable
CREATE TABLE `rates` (
    `rate_id` VARCHAR(24) NOT NULL,
    `rate_kind` VARCHAR(24) NOT NULL,
    `user_rate_id` VARCHAR(24) NOT NULL,
    `post_rate_id` VARCHAR(24) NOT NULL,
    `comment_rate_id` VARCHAR(24) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`rate_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `rates` ADD CONSTRAINT `rates_user_rate_id_fkey` FOREIGN KEY (`user_rate_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rates` ADD CONSTRAINT `rates_post_rate_id_fkey` FOREIGN KEY (`post_rate_id`) REFERENCES `posts`(`post_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rates` ADD CONSTRAINT `rates_comment_rate_id_fkey` FOREIGN KEY (`comment_rate_id`) REFERENCES `comments`(`comment_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
