RENAME TABLE `galleryItems` TO `gallery_items`;--> statement-breakpoint
RENAME TABLE `modelProfile` TO `model_profile`;--> statement-breakpoint
ALTER TABLE `model_profile` RENAME COLUMN `nextLiveTime` TO `lastLiveTime`;--> statement-breakpoint
ALTER TABLE `gallery_items` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `model_profile` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `gallery_items` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `model_profile` ADD PRIMARY KEY(`id`);