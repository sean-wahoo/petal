-- AlterTable
ALTER TABLE `posts` MODIFY `is_edited` BIT(1) NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `users` MODIFY `been_welcomed` BIT(1) NOT NULL DEFAULT false;
