/*
  Warnings:

  - You are about to alter the column `is_reply` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `VarChar(24)` to `Bit(1)`.

*/
-- AlterTable
ALTER TABLE `comments` MODIFY `is_reply` BIT(1) NOT NULL;

-- AlterTable
ALTER TABLE `posts` MODIFY `is_edited` BIT(1) NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `users` MODIFY `been_welcomed` BIT(1) NOT NULL DEFAULT false;
