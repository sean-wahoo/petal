/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `posts` (
    `post_id` VARCHAR(24) NOT NULL,
    `author_user_id` VARCHAR(24) NOT NULL,
    `title` TEXT NOT NULL,
    `content` TEXT NOT NULL,
    `is_edited` BIT(1) NOT NULL,
    `ups` INTEGER NOT NULL,
    `downs` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`post_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comments` (
    `comment_id` VARCHAR(24) NOT NULL,
    `author_user_id` VARCHAR(24) NOT NULL,
    `content` TEXT NOT NULL,
    `parent_id` VARCHAR(24) NOT NULL,
    `is_reply` VARCHAR(24) NOT NULL,
    `is_edited` BIT(1) NOT NULL,
    `ups` INTEGER NOT NULL,
    `downs` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`comment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `users_email_key` ON `users`(`email`);
