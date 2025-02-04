PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_account` (
	`id` text PRIMARY KEY NOT NULL,
	`accountId` text NOT NULL,
	`providerId` text NOT NULL,
	`userId` text NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`idToken` text,
	`accessTokenExpiresAt` integer,
	`refreshTokenExpiresAt` integer,
	`scope` text,
	`password` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_account`("id", "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", "scope", "password", "createdAt", "updatedAt") SELECT "id", "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", "scope", "password", "createdAt", "updatedAt" FROM `account`;--> statement-breakpoint
DROP TABLE `account`;--> statement-breakpoint
ALTER TABLE `__new_account` RENAME TO `account`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
DROP INDEX `user_id_unique`;--> statement-breakpoint
DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "field_name_unique";--> statement-breakpoint
DROP INDEX "by_userId_idx";--> statement-breakpoint
DROP INDEX "by_createdAt_idx";--> statement-breakpoint
DROP INDEX "by_field_name_idx";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
DROP INDEX "user_phoneNumber_unique";--> statement-breakpoint
DROP INDEX "by_id_idx";--> statement-breakpoint
DROP INDEX "by_phoneNumber_idx";--> statement-breakpoint
DROP INDEX "by_user_name_idx";--> statement-breakpoint
ALTER TABLE `user` ALTER COLUMN "phoneNumber" TO "phoneNumber" text;--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `field_name_unique` ON `field` (`name`);--> statement-breakpoint
CREATE INDEX `by_userId_idx` ON `field` (`userId`);--> statement-breakpoint
CREATE INDEX `by_createdAt_idx` ON `field` (`createdAt`);--> statement-breakpoint
CREATE UNIQUE INDEX `by_field_name_idx` ON `field` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_phoneNumber_unique` ON `user` (`phoneNumber`);--> statement-breakpoint
CREATE UNIQUE INDEX `by_id_idx` ON `user` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `by_phoneNumber_idx` ON `user` (`phoneNumber`);--> statement-breakpoint
CREATE INDEX `by_user_name_idx` ON `user` (`name`);--> statement-breakpoint
ALTER TABLE `session` ALTER COLUMN "createdAt" TO "createdAt" integer NOT NULL;--> statement-breakpoint
ALTER TABLE `session` ALTER COLUMN "updatedAt" TO "updatedAt" integer NOT NULL;--> statement-breakpoint
CREATE TABLE `__new_verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`createdAt` integer,
	`updatedAt` integer
);
--> statement-breakpoint
INSERT INTO `__new_verification`("id", "identifier", "value", "expiresAt", "createdAt", "updatedAt") SELECT "id", "identifier", "value", "expiresAt", "createdAt", "updatedAt" FROM `verification`;--> statement-breakpoint
DROP TABLE `verification`;--> statement-breakpoint
ALTER TABLE `__new_verification` RENAME TO `verification`;