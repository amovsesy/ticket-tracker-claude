<script lang="ts">
	import clerk from './store.js';

	import type { SignUpProps, SignUpRedirectOptions } from '@clerk/types';
	import type { HTMLButtonAttributes } from 'svelte/elements';
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
	}: SignUpProps &
		SignUpRedirectOptions &
		ClerkButtonChildProps &
		HTMLButtonAttributes &
		RestProps = $props();

	function signUp() {
		if (mode === 'modal') {
			const signUpOptions: SignUpProps = {
				...restProps
			};

			return $clerk?.openSignUp(signUpOptions);
		}

		const redirectOptions: SignUpRedirectOptions = {
			...restProps
		};
		return $clerk?.redirectToSignUp(redirectOptions);
	}
</script>

<Button variant="link" onclick={signUp} {...restProps}>{text || 'Sign Up'}</Button>
