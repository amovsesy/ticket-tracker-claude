<script lang="ts">
	import clerk from './store';
	import type { SignUpProps } from '@clerk/types';
	import { onMount } from 'svelte';

	const { ...props }: SignUpProps = $props();

	onMount(() => {
		if ($clerk) {
			const signUpDiv = document.getElementById('sign-up') as HTMLDivElement;
			$clerk.mountSignUp(signUpDiv, props);
		}
	});
</script>

<div id="sign-up"></div>
