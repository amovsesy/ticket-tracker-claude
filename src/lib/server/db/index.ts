import { drizzle } from 'drizzle-orm/d1';
import type { D1Database } from '@cloudflare/workers-types';
import * as schema from './schema';

/**
 * Get the database instance for use in server-side code
 * @param d1 - D1 database binding from platform.env
 * @returns Drizzle database instance
 */
export function getDb(d1: D1Database) {
	return drizzle(d1, { schema });
}

// Type for the database instance
export type Database = ReturnType<typeof getDb>;

// Re-export schema for convenience
export * from './schema';
