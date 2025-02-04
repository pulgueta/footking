DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "field_name_unique";--> statement-breakpoint
DROP INDEX "by_userId_idx";--> statement-breakpoint
DROP INDEX "by_createdAt_idx";--> statement-breakpoint
DROP INDEX "by_field_name_idx";--> statement-breakpoint
DROP INDEX "user_id_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
DROP INDEX "user_phoneNumber_unique";--> statement-breakpoint
DROP INDEX "by_id_idx";--> statement-breakpoint
DROP INDEX "by_phoneNumber_idx";--> statement-breakpoint
DROP INDEX "by_user_name_idx";--> statement-breakpoint
ALTER TABLE `user` ALTER COLUMN "role" TO "role" text DEFAULT 'owner';--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `field_name_unique` ON `field` (`name`);--> statement-breakpoint
CREATE INDEX `by_userId_idx` ON `field` (`userId`);--> statement-breakpoint
CREATE INDEX `by_createdAt_idx` ON `field` (`createdAt`);--> statement-breakpoint
CREATE UNIQUE INDEX `by_field_name_idx` ON `field` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_id_unique` ON `user` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_phoneNumber_unique` ON `user` (`phoneNumber`);--> statement-breakpoint
CREATE UNIQUE INDEX `by_id_idx` ON `user` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `by_phoneNumber_idx` ON `user` (`phoneNumber`);--> statement-breakpoint
CREATE INDEX `by_user_name_idx` ON `user` (`name`);