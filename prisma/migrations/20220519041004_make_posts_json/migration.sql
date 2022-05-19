/*
  Warnings:

  - You are about to alter the column `content` on the `posts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Json`.

*/
-- AlterTable
ALTER TABLE `posts` MODIFY `content` JSON NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `been_welcomed` BIT(1) NOT NULL DEFAULT false;
