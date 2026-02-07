import type { ClerkOptions } from '@clerk/types';
import clerk from './store';

export const DEFAULT_OPTIONS: ClerkOptions = {
	signInFallbackRedirectUrl: '/dashboard',
	signUpFallbackRedirectUrl: '/dashboard',
	signInUrl: '/login',
	signUpUrl: '/signup'
};

export default async function initializeClerkClient(
	key: string,
	options: ClerkOptions = DEFAULT_OPTIONS
): Promise<void> {
	// Only run on client side
	if (typeof window === 'undefined') {
		return;
	}

	// Dynamic import to avoid SSR issues
	const { Clerk } = await import('@clerk/clerk-js');
	const instance = new Clerk(key);

	await instance.load(options).catch((error: Error) => {
		console.error('[Clerk SvelteKit] Failed to load Clerk:', error);
	});

	instance.addListener((event) => {
		if (event.user) {
			document.dispatchEvent(new CustomEvent('clerk-sveltekit:user', { detail: event.user }));
		}
	});

	clerk.set(instance);

	clerk.subscribe((clerkInstance) => {
		if (clerkInstance) {
			window.Clerk = clerkInstance;
		}
	});
}
