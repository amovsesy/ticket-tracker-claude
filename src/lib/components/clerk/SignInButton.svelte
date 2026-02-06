<script lang="ts">
	import clerk from './store.js';

	import type { SignInProps, SignInRedirectOptions } from '@clerk/types';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import type { Component } from 'svelte';

	import type { ClerkButtonChildProps } from '$lib/types';
	import { Button } from '$lib/components/ui/button';

	type RestProps = {
		[key: string]: string | Component;
	};

	const {
		text,
		mode = 'redirect',
		...restProps
	}: SignInProps &
		SignInRedirectOptions &
		ClerkButtonChildProps &
		HTMLButtonAttributes &
		HTMLAnchorAttributes &
		RestProps = $props();

	function signIn() {
		if (mode === 'modal') {
			const signInOptions: SignInProps = {
				...restProps
			};

			return $clerk?.openSignIn(signInOptions);
		}

		const redirectOptions: SignInRedirectOptions = {
			...restProps
		};
		return $clerk?.redirectToSignIn(redirectOptions);
	}
</script>

<Button variant="link" onclick={signIn} {...restProps}>{text || 'Sign In'}</Button>
