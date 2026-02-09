import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	out: './migrations',
	dialect: 'sqlite',
	dbCredentials: {
		url: '.wrangler/state/v3/d1/miniflare-D1DatabaseObject/07aab016e84ad8ea31cf597462a93cc39e18560352f030c455eb837d79435302.sqlite'
	},
	verbose: true,
	strict: true
});
