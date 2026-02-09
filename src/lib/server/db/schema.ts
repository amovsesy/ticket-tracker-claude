import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';

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
	isAdmin: integer('is_admin', { mode: 'boolean' }).notNull().default(false),
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
	(table) => [
		index('idx_events_date').on(table.date),
		index('idx_events_category').on(table.category)
	]
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

/**
 * Admin Audit Logs table - Track all admin actions for security and compliance
 */
export const adminAuditLogs = sqliteTable(
	'admin_audit_logs',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		adminUserId: integer('admin_user_id')
			.notNull()
			.references(() => users.id),
		action: text('action').notNull(), // 'view_user', 'edit_event', 'send_notification', etc.
		targetType: text('target_type'), // 'user', 'event', 'notification'
		targetId: integer('target_id'), // ID of the affected resource
		details: text('details'), // JSON string with additional context
		ipAddress: text('ip_address'),
		userAgent: text('user_agent'),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(table) => [
		index('idx_admin_audit_admin_user').on(table.adminUserId),
		index('idx_admin_audit_created_at').on(table.createdAt),
		index('idx_admin_audit_action').on(table.action)
	]
);

/**
 * User Demo Mode table - Store mock/demo data toggle state per user
 */
export const userDemoMode = sqliteTable('user_demo_mode', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' })
		.unique(),
	isEnabled: integer('is_enabled', { mode: 'boolean' }).notNull().default(false),
	enabledBy: integer('enabled_by').references(() => users.id), // Admin who enabled it
	enabledAt: integer('enabled_at', { mode: 'timestamp' }),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

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

export type AdminAuditLog = typeof adminAuditLogs.$inferSelect;
export type NewAdminAuditLog = typeof adminAuditLogs.$inferInsert;

export type UserDemoMode = typeof userDemoMode.$inferSelect;
export type NewUserDemoMode = typeof userDemoMode.$inferInsert;

// Pricing variants enum
export const pricingVariants = [
	'launch_promo',
	'pay_per_event',
	'percentage_savings',
	'pay_per_sms_tips',
	'tips_only'
] as const;
export type PricingVariant = (typeof pricingVariants)[number];

/**
 * Pricing Configuration table - Stores admin-controlled pricing settings
 */
export const pricingConfig = sqliteTable('pricing_config', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	variant: text('variant', { enum: pricingVariants }).notNull().default('launch_promo'),
	promoEnabled: integer('promo_enabled', { mode: 'boolean' }).notNull().default(true),
	promoDiscount: integer('promo_discount').notNull().default(100), // 0-100 percentage
	promoMessage: text('promo_message').default('100% Off Pro Plan - Launch Special'),
	payPerEventCost: real('pay_per_event_cost').default(0.99),
	percentageSavings: integer('percentage_savings').default(10), // 0-100 percentage
	smsPerMessageCost: real('sms_per_message_cost').default(0.05),
	updatedBy: integer('updated_by').references(() => users.id),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export type PricingConfig = typeof pricingConfig.$inferSelect;
export type NewPricingConfig = typeof pricingConfig.$inferInsert;
