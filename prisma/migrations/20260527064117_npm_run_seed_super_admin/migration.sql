-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` ENUM('SUPER_ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    `status` ENUM('ACTIVE', 'DISABLED') NOT NULL DEFAULT 'ACTIVE',
    `lastLoginAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `sessionTokenHash` VARCHAR(191) NOT NULL,
    `expireAt` DATETIME(3) NOT NULL,
    `ip` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionTokenHash_key`(`sessionTokenHash`),
    INDEX `Session_userId_idx`(`userId`),
    INDEX `Session_expireAt_idx`(`expireAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RegisteredBlog` (
    `id` VARCHAR(191) NOT NULL,
    `ownerId` VARCHAR(191) NOT NULL,
    `blogId` VARCHAR(191) NOT NULL,
    `type` ENUM('website', 'hexo') NOT NULL DEFAULT 'website',
    `name` VARCHAR(191) NOT NULL,
    `domain` VARCHAR(191) NOT NULL,
    `officialAccountName` VARCHAR(191) NOT NULL,
    `replyKeyword` VARCHAR(191) NOT NULL DEFAULT '验证码',
    `qrcodeUrl` VARCHAR(191) NOT NULL,
    `unlockExpiresDays` INTEGER NOT NULL DEFAULT 7,
    `captchaExpiresSeconds` INTEGER NOT NULL DEFAULT 300,
    `captchaSecret` VARCHAR(191) NOT NULL,
    `randomPercent` INTEGER NOT NULL DEFAULT 100,
    `allowMobile` BOOLEAN NOT NULL DEFAULT false,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `RegisteredBlog_blogId_key`(`blogId`),
    INDEX `RegisteredBlog_ownerId_idx`(`ownerId`),
    INDEX `RegisteredBlog_blogId_idx`(`blogId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UnlockRecord` (
    `id` VARCHAR(191) NOT NULL,
    `blogId` VARCHAR(191) NOT NULL,
    `registeredId` VARCHAR(191) NOT NULL,
    `ownerId` VARCHAR(191) NOT NULL,
    `visitorId` VARCHAR(191) NULL,
    `ip` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `articleUrl` VARCHAR(191) NULL,
    `articleTitle` VARCHAR(191) NULL,
    `unlockMethod` ENUM('CAPTCHA') NOT NULL DEFAULT 'CAPTCHA',
    `randomPercent` INTEGER NOT NULL DEFAULT 100,
    `success` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UnlockRecord_blogId_idx`(`blogId`),
    INDEX `UnlockRecord_registeredId_idx`(`registeredId`),
    INDEX `UnlockRecord_ownerId_idx`(`ownerId`),
    INDEX `UnlockRecord_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AccessGrant` (
    `id` VARCHAR(191) NOT NULL,
    `blogId` VARCHAR(191) NOT NULL,
    `registeredId` VARCHAR(191) NOT NULL,
    `visitorId` VARCHAR(191) NOT NULL,
    `tokenHash` VARCHAR(191) NOT NULL,
    `expireAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `AccessGrant_tokenHash_key`(`tokenHash`),
    INDEX `AccessGrant_blogId_idx`(`blogId`),
    INDEX `AccessGrant_registeredId_idx`(`registeredId`),
    INDEX `AccessGrant_visitorId_idx`(`visitorId`),
    INDEX `AccessGrant_expireAt_idx`(`expireAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RegisteredBlog` ADD CONSTRAINT `RegisteredBlog_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UnlockRecord` ADD CONSTRAINT `UnlockRecord_registeredId_fkey` FOREIGN KEY (`registeredId`) REFERENCES `RegisteredBlog`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UnlockRecord` ADD CONSTRAINT `UnlockRecord_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessGrant` ADD CONSTRAINT `AccessGrant_registeredId_fkey` FOREIGN KEY (`registeredId`) REFERENCES `RegisteredBlog`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
