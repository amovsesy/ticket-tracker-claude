CREATE TABLE `pricing_config` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`variant` text DEFAULT 'launch_promo' NOT NULL,
	`promo_enabled` integer DEFAULT true NOT NULL,
	`promo_discount` integer DEFAULT 100 NOT NULL,
	`promo_message` text DEFAULT '100% Off Pro Plan - Launch Special',
	`pay_per_event_cost` real DEFAULT 0.99,
	`percentage_savings` integer DEFAULT 10,
	`sms_per_message_cost` real DEFAULT 0.05,
	`updated_by` integer,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
