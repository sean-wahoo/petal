/*
  Warnings:

  - You are about to drop the column `session_id` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cache_key]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `users_session_id_key` ON `users`;

-- AlterTable
ALTER TABLE `posts` MODIFY `is_edited` BIT(1) NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `session_id`,
    ADD COLUMN `cache_key` VARCHAR(24) NULL,
    MODIFY `been_welcomed` BIT(1) NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `users_cache_key_key` ON `users`(`cache_key`);
