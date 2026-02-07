import _initializeClerkClient, { DEFAULT_OPTIONS } from './initializeClerkClient';

type Params = Parameters<typeof _initializeClerkClient>;

export async function initializeClerkClient(
	key: Params[0],
	options: Params[1] = DEFAULT_OPTIONS
): Promise<void> {
	return _initializeClerkClient(key, options);
}

export { default as SignedIn } from './SignedIn.svelte';
export { default as SignedOut } from './SignedOut.svelte';
export { default as SignIn } from './SignIn.svelte';
export { default as SignUp } from './SignUp.svelte';
export { default as SignInButton } from './SignInButton.svelte';
export { default as SignUpButton } from './SignUpButton.svelte';
export { default as ClerkLoaded } from './ClerkLoaded.svelte';
export { default as ClerkLoading } from './ClerkLoading.svelte';
export { default as UserButton } from './UserButton.svelte';
