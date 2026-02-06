<script lang="ts">
	import clerk from './store';
	import type { SignInProps } from '@clerk/types';
	import { onMount } from 'svelte';

	const { ...props }: SignInProps = $props();

	onMount(() => {
		if ($clerk) {
			const signInDiv = document.getElementById('sign-in') as HTMLDivElement;
			$clerk.mountSignIn(signInDiv, props);
		}
	});
</script>

<div id="sign-in"></div>
