DROP TABLE `jwks`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_session` (
	`id` text PRIMARY KEY NOT NULL,
	`expiresAt` integer NOT NULL,
	`token` text NOT NULL,
	`ipAddress` text,
	`userAgent` text,
	`userId` text NOT NULL,
	`createdAt` integer,
	`updatedAt` integer,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_session`("id", "expiresAt", "token", "ipAddress", "userAgent", "userId", "createdAt", "updatedAt") SELECT "id", "expiresAt", "token", "ipAddress", "userAgent", "userId", "createdAt", "updatedAt" FROM `session`;--> statement-breakpoint
DROP TABLE `session`;--> statement-breakpoint
ALTER TABLE `__new_session` RENAME TO `session`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
ALTER TABLE `booking` ADD `bookingTotalValue` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `email` text NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `emailVerified` integer NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);