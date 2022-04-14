-- CreateTable
CREATE TABLE `users` (
    `user_id` VARCHAR(24) NOT NULL,
    `email` VARCHAR(54) NOT NULL,
    `password` TEXT NULL,
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `session_id` VARCHAR(24) NULL,
    `image_url` TEXT NOT NULL,
    `display_name` TEXT NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
