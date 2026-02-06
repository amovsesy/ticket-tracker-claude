import * as Sentry from '@sentry/sveltekit';

Sentry.init({
	dsn: 'https://e245c98d758b194934ab0fea862bbc1b@o4508550435766272.ingest.us.sentry.io/4508556699828224',

	tracesSampleRate: 1.0,

	// Enable logs to be sent to Sentry
	enableLogs: true

	// uncomment the line below to enable Spotlight (https://spotlightjs.com)
	// spotlight: import.meta.env.DEV,
});
