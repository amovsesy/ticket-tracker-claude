// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { D1Database } from '@cloudflare/workers-types';
import type { JWTPayload } from '@clerk/backend';

declare global {
	namespace App {
		interface Locals {
			session?: {
				userId: string;
				claims: JWTPayload;
			};
		}
		interface Platform {
			env: {
				DB: D1Database;
			} & Env;
			cf: CfProperties;
			ctx: ExecutionContext;
		}
	}
}

export {};
