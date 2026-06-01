-- AlterTable
ALTER TABLE `RegisteredBlog`
  ADD COLUMN `previewHeight` INTEGER NOT NULL DEFAULT 480,
  ADD COLUMN `protectionMode` VARCHAR(191) NOT NULL DEFAULT 'all',
  ADD COLUMN `whitelistRules` JSON NULL,
  ADD COLUMN `protectionRules` JSON NULL;
