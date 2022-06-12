/*
  Warnings:

  - A unique constraint covering the columns `[post_rate_id]` on the table `rates` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[comment_rate_id]` on the table `rates` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `posts` MODIFY `is_edited` BIT(1) NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `users` MODIFY `been_welcomed` BIT(1) NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `rates_post_rate_id_key` ON `rates`(`post_rate_id`);

-- CreateIndex
CREATE UNIQUE INDEX `rates_comment_rate_id_key` ON `rates`(`comment_rate_id`);
