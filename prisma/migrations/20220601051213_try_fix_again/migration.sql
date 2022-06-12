-- DropForeignKey
ALTER TABLE `rates` DROP FOREIGN KEY `rates_comment_rate_id_fkey`;

-- DropForeignKey
ALTER TABLE `rates` DROP FOREIGN KEY `rates_post_rate_id_fkey`;

-- AlterTable
ALTER TABLE `posts` MODIFY `is_edited` BIT(1) NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `rates` MODIFY `post_rate_id` VARCHAR(24) NULL,
    MODIFY `comment_rate_id` VARCHAR(24) NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `been_welcomed` BIT(1) NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `rates` ADD CONSTRAINT `rates_post_rate_id_fkey` FOREIGN KEY (`post_rate_id`) REFERENCES `posts`(`post_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rates` ADD CONSTRAINT `rates_comment_rate_id_fkey` FOREIGN KEY (`comment_rate_id`) REFERENCES `comments`(`comment_id`) ON DELETE SET NULL ON UPDATE CASCADE;
