import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	out: './migrations',
	dialect: 'sqlite',
	dbCredentials: {
		url: 'local.db'
	},
	verbose: true,
	strict: true
});
