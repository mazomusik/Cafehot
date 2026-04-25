CREATE TABLE `galleryItems` (
	`id` varchar(64) NOT NULL,
	`uri` text NOT NULL,
	`type` enum('photo','video') NOT NULL,
	`isPrivate` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `galleryItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `modelProfile` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`age` int NOT NULL,
	`city` varchar(255) NOT NULL,
	`bio` text,
	`profilePhoto` text,
	`coverPhoto` text,
	`subscriptionPrice` int NOT NULL DEFAULT 8000,
	`subscribers` int NOT NULL DEFAULT 8352,
	`whatsappNumber` varchar(20) NOT NULL,
	`breKey` varchar(255) NOT NULL,
	`isLive` boolean NOT NULL DEFAULT false,
	`nextLiveTime` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `modelProfile_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`deviceId` varchar(255) NOT NULL,
	`isSubscribed` boolean NOT NULL DEFAULT false,
	`subscriptionDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscribers_deviceId_unique` UNIQUE(`deviceId`)
);
