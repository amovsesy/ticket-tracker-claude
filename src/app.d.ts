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
				RESEND_API_KEY?: string;
				PLIVO_AUTH_ID?: string;
				PLIVO_AUTH_TOKEN?: string;
				PLIVO_PHONE_NUMBER?: string;
				STATSIG_SERVER_KEY?: string;
			} & Env;
			cf: CfProperties;
			ctx: ExecutionContext;
		}
	}
}

export {};
