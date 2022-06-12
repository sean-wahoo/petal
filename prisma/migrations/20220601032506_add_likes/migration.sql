-- AlterTable
ALTER TABLE `posts` MODIFY `is_edited` BIT(1) NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `users` MODIFY `been_welcomed` BIT(1) NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `likes` (
    `like_id` VARCHAR(24) NOT NULL,
    `user_like_id` VARCHAR(24) NOT NULL,
    `post_like_id` VARCHAR(24) NOT NULL,
    `comment_like_id` VARCHAR(24) NOT NULL,

    PRIMARY KEY (`like_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_user_like_id_fkey` FOREIGN KEY (`user_like_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_post_like_id_fkey` FOREIGN KEY (`post_like_id`) REFERENCES `posts`(`post_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_comment_like_id_fkey` FOREIGN KEY (`comment_like_id`) REFERENCES `comments`(`comment_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
