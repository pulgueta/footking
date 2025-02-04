CREATE TABLE `account` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`accountId` text NOT NULL,
	`providerId` text NOT NULL,
	`userId` integer NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`idToken` text,
	`scope` text,
	`password` text,
	`createdAt` integer,
	`updatedAt` integer,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `jwks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`publicKey` text NOT NULL,
	`privateKey` text NOT NULL,
	`createdAt` integer,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expiresAt` integer NOT NULL,
	`token` text NOT NULL,
	`ipAddress` text,
	`userAgent` text,
	`userId` integer NOT NULL,
	`createdAt` integer,
	`updatedAt` integer,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`createdAt` integer,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE TABLE `booking` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reservedBy` text NOT NULL,
	`fieldId` integer NOT NULL,
	`day` text NOT NULL,
	`startHour` text NOT NULL,
	`endHour` text NOT NULL,
	`createdAt` integer,
	`updatedAt` integer,
	FOREIGN KEY (`fieldId`) REFERENCES `field`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `field` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`address` text NOT NULL,
	`state` text NOT NULL,
	`city` text NOT NULL,
	`hourlyRate` integer NOT NULL,
	`userId` text NOT NULL,
	`availability` text NOT NULL,
	`createdAt` integer,
	`updatedAt` integer,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `field_name_unique` ON `field` (`name`);--> statement-breakpoint
CREATE INDEX `by_userId_idx` ON `field` (`userId`);--> statement-breakpoint
CREATE INDEX `by_createdAt_idx` ON `field` (`createdAt`);--> statement-breakpoint
CREATE UNIQUE INDEX `by_field_name_idx` ON `field` (`name`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`image` text,
	`role` text NOT NULL,
	`phoneNumber` text NOT NULL,
	`phoneNumberVerified` integer,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_id_unique` ON `user` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_phoneNumber_unique` ON `user` (`phoneNumber`);--> statement-breakpoint
CREATE UNIQUE INDEX `by_id_idx` ON `user` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `by_phoneNumber_idx` ON `user` (`phoneNumber`);--> statement-breakpoint
CREATE INDEX `by_user_name_idx` ON `user` (`name`);