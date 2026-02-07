import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// User tiers enum
export const userTiers = ['free', 'pro'] as const;
export type UserTier = (typeof userTiers)[number];

// Notification types enum
export const notificationTypes = ['email', 'sms'] as const;
export type NotificationType = (typeof notificationTypes)[number];

// Notification frequency enum
export const notificationFrequencies = ['realtime', 'daily'] as const;
export type NotificationFrequency = (typeof notificationFrequencies)[number];

// Platform enum
export const platforms = ['stubhub', 'ticketmaster', 'seatgeek'] as const;
export type Platform = (typeof platforms)[number];

// Event category enum
export const eventCategories = ['sports', 'concerts', 'theater', 'other'] as const;
export type EventCategory = (typeof eventCategories)[number];

/**
 * Users table - Stores user information from Clerk auth
 */
export const users = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	clerkId: text('clerk_id').notNull().unique(),
	email: text('email').notNull(),
	phone: text('phone'),
	tier: text('tier', { enum: userTiers }).notNull().default('free'),
	emailNotifications: integer('email_notifications', { mode: 'boolean' }).notNull().default(true),
	smsNotifications: integer('sms_notifications', { mode: 'boolean' }).notNull().default(false),
	notificationFrequency: text('notification_frequency', { enum: notificationFrequencies })
		.notNull()
		.default('realtime'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

/**
 * Events table - Stores event information
 */
export const events = sqliteTable(
	'events',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		name: text('name').notNull(),
		venue: text('venue').notNull(),
		location: text('location').notNull(),
		date: integer('date', { mode: 'timestamp' }).notNull(),
		category: text('category', { enum: eventCategories }).notNull().default('other'),
		imageUrl: text('image_url'),
		description: text('description'),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer('updated_at', { mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(table) => [index('idx_events_date').on(table.date), index('idx_events_category').on(table.category)]
);

/**
 * Platform Sources table - Maps events to ticketing platform URLs
 * One event can have multiple platform URLs (StubHub, Ticketmaster, SeatGeek)
 */
export const platformSources = sqliteTable(
	'platform_sources',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		eventId: integer('event_id')
			.notNull()
			.references(() => events.id, { onDelete: 'cascade' }),
		platform: text('platform', { enum: platforms }).notNull(),
		url: text('url').notNull(),
		externalId: text('external_id'), // Platform-specific event ID
		lastScrapedAt: integer('last_scraped_at', { mode: 'timestamp' }),
		lastSuccessfulScrapeAt: integer('last_successful_scrape_at', { mode: 'timestamp' }),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(table) => [
		index('idx_platform_sources_event').on(table.eventId),
		index('idx_platform_sources_platform').on(table.platform)
	]
);

/**
 * Tracked Events table - User's tracked events with target price and preferences
 */
export const trackedEvents = sqliteTable(
	'tracked_events',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		userId: integer('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		eventId: integer('event_id')
			.notNull()
			.references(() => events.id, { onDelete: 'cascade' }),
		targetPrice: real('target_price').notNull(),
		section: text('section'), // Preferred section (e.g., "Lower Bowl", "Floor")
		isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
		isPaused: integer('is_paused', { mode: 'boolean' }).notNull().default(false),
		lastNotifiedAt: integer('last_notified_at', { mode: 'timestamp' }),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer('updated_at', { mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(table) => [
		index('idx_tracked_events_user').on(table.userId),
		index('idx_tracked_events_event').on(table.eventId),
		index('idx_tracked_events_active').on(table.isActive)
	]
);

/**
 * Price History table - Historical prices for each platform source
 */
export const priceHistory = sqliteTable(
	'price_history',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		platformSourceId: integer('platform_source_id')
			.notNull()
			.references(() => platformSources.id, { onDelete: 'cascade' }),
		price: real('price').notNull(),
		section: text('section'), // Section name (e.g., "Lower Bowl 101")
		quantity: integer('quantity'), // Number of tickets available at this price
		percentageChange: real('percentage_change'), // Percentage change from previous price
		scrapedAt: integer('scraped_at', { mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(table) => [
		index('idx_price_history_platform_source').on(table.platformSourceId),
		index('idx_price_history_scraped_at').on(table.scrapedAt)
	]
);

/**
 * Notifications table - History of sent notifications
 */
export const notifications = sqliteTable(
	'notifications',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		userId: integer('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		trackedEventId: integer('tracked_event_id')
			.notNull()
			.references(() => trackedEvents.id, { onDelete: 'cascade' }),
		type: text('type', { enum: notificationTypes }).notNull(),
		recipient: text('recipient').notNull(), // Email address or phone number
		subject: text('subject'),
		message: text('message').notNull(),
		sentAt: integer('sent_at', { mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date()),
		wasSuccessful: integer('was_successful', { mode: 'boolean' }).notNull().default(true),
		errorMessage: text('error_message')
	},
	(table) => [
		index('idx_notifications_user').on(table.userId),
		index('idx_notifications_tracked_event').on(table.trackedEventId),
		index('idx_notifications_sent_at').on(table.sentAt)
	]
);

/**
 * Scraping Logs table - Debug logs for scraper failures
 */
export const scrapingLogs = sqliteTable(
	'scraping_logs',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		platformSourceId: integer('platform_source_id')
			.notNull()
			.references(() => platformSources.id, { onDelete: 'cascade' }),
		status: text('status', { enum: ['success', 'failure', 'partial'] }).notNull(),
		errorMessage: text('error_message'),
		responseCode: integer('response_code'),
		duration: integer('duration'), // Duration in milliseconds
		createdAt: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(table) => [
		index('idx_scraping_logs_platform_source').on(table.platformSourceId),
		index('idx_scraping_logs_status').on(table.status),
		index('idx_scraping_logs_created_at').on(table.createdAt)
	]
);

// Export types for use in application
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

export type PlatformSource = typeof platformSources.$inferSelect;
export type NewPlatformSource = typeof platformSources.$inferInsert;

export type TrackedEvent = typeof trackedEvents.$inferSelect;
export type NewTrackedEvent = typeof trackedEvents.$inferInsert;

export type PriceHistory = typeof priceHistory.$inferSelect;
export type NewPriceHistory = typeof priceHistory.$inferInsert;

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;

export type ScrapingLog = typeof scrapingLogs.$inferSelect;
export type NewScrapingLog = typeof scrapingLogs.$inferInsert;
