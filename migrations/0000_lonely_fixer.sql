CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`venue` text NOT NULL,
	`location` text NOT NULL,
	`date` integer NOT NULL,
	`category` text DEFAULT 'other' NOT NULL,
	`image_url` text,
	`description` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_events_date` ON `events` (`date`);--> statement-breakpoint
CREATE INDEX `idx_events_category` ON `events` (`category`);--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`tracked_event_id` integer NOT NULL,
	`type` text NOT NULL,
	`recipient` text NOT NULL,
	`subject` text,
	`message` text NOT NULL,
	`sent_at` integer NOT NULL,
	`was_successful` integer DEFAULT true NOT NULL,
	`error_message` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tracked_event_id`) REFERENCES `tracked_events`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_notifications_user` ON `notifications` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_notifications_tracked_event` ON `notifications` (`tracked_event_id`);--> statement-breakpoint
CREATE INDEX `idx_notifications_sent_at` ON `notifications` (`sent_at`);--> statement-breakpoint
CREATE TABLE `platform_sources` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` integer NOT NULL,
	`platform` text NOT NULL,
	`url` text NOT NULL,
	`external_id` text,
	`last_scraped_at` integer,
	`last_successful_scrape_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_platform_sources_event` ON `platform_sources` (`event_id`);--> statement-breakpoint
CREATE INDEX `idx_platform_sources_platform` ON `platform_sources` (`platform`);--> statement-breakpoint
CREATE TABLE `price_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`platform_source_id` integer NOT NULL,
	`price` real NOT NULL,
	`section` text,
	`quantity` integer,
	`percentage_change` real,
	`scraped_at` integer NOT NULL,
	FOREIGN KEY (`platform_source_id`) REFERENCES `platform_sources`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_price_history_platform_source` ON `price_history` (`platform_source_id`);--> statement-breakpoint
CREATE INDEX `idx_price_history_scraped_at` ON `price_history` (`scraped_at`);--> statement-breakpoint
CREATE TABLE `scraping_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`platform_source_id` integer NOT NULL,
	`status` text NOT NULL,
	`error_message` text,
	`response_code` integer,
	`duration` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`platform_source_id`) REFERENCES `platform_sources`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_scraping_logs_platform_source` ON `scraping_logs` (`platform_source_id`);--> statement-breakpoint
CREATE INDEX `idx_scraping_logs_status` ON `scraping_logs` (`status`);--> statement-breakpoint
CREATE INDEX `idx_scraping_logs_created_at` ON `scraping_logs` (`created_at`);--> statement-breakpoint
CREATE TABLE `tracked_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`event_id` integer NOT NULL,
	`target_price` real NOT NULL,
	`section` text,
	`is_active` integer DEFAULT true NOT NULL,
	`is_paused` integer DEFAULT false NOT NULL,
	`last_notified_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_tracked_events_user` ON `tracked_events` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_tracked_events_event` ON `tracked_events` (`event_id`);--> statement-breakpoint
CREATE INDEX `idx_tracked_events_active` ON `tracked_events` (`is_active`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`clerk_id` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`tier` text DEFAULT 'free' NOT NULL,
	`email_notifications` integer DEFAULT true NOT NULL,
	`sms_notifications` integer DEFAULT false NOT NULL,
	`notification_frequency` text DEFAULT 'realtime' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_clerk_id_unique` ON `users` (`clerk_id`);