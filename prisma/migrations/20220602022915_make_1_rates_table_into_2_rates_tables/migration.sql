/*
  Warnings:

  - You are about to drop the `rates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `rates` DROP FOREIGN KEY `rates_comment_rate_id_fkey`;

-- DropForeignKey
ALTER TABLE `rates` DROP FOREIGN KEY `rates_post_rate_id_fkey`;

-- DropForeignKey
ALTER TABLE `rates` DROP FOREIGN KEY `rates_user_rate_id_fkey`;

-- AlterTable
ALTER TABLE `posts` MODIFY `is_edited` BIT(1) NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `users` MODIFY `been_welcomed` BIT(1) NOT NULL DEFAULT false;

-- DropTable
DROP TABLE `rates`;

-- CreateTable
CREATE TABLE `post_rates` (
    `rate_kind` VARCHAR(24) NOT NULL,
    `user_rate_id` VARCHAR(24) NOT NULL,
    `post_rate_id` VARCHAR(24) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`user_rate_id`, `post_rate_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comment_rates` (
    `rate_kind` VARCHAR(24) NOT NULL,
    `user_rate_id` VARCHAR(24) NOT NULL,
    `comment_rate_id` VARCHAR(24) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`user_rate_id`, `comment_rate_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `post_rates` ADD CONSTRAINT `post_rates_user_rate_id_fkey` FOREIGN KEY (`user_rate_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_rates` ADD CONSTRAINT `post_rates_post_rate_id_fkey` FOREIGN KEY (`post_rate_id`) REFERENCES `posts`(`post_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment_rates` ADD CONSTRAINT `comment_rates_user_rate_id_fkey` FOREIGN KEY (`user_rate_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment_rates` ADD CONSTRAINT `comment_rates_comment_rate_id_fkey` FOREIGN KEY (`comment_rate_id`) REFERENCES `comments`(`comment_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
