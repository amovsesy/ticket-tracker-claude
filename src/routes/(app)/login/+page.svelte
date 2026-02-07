<script lang="ts">
	import SignIn from '$lib/components/clerk/SignIn.svelte';
	import ClerkLoaded from '$lib/components/clerk/ClerkLoaded.svelte';

	import { page } from '$app/state';

	const signupUrl = $derived(
		'/signup' + (page.url.searchParams.has('eid') ? `?eid=${page.url.searchParams.get('eid')}` : '')
	);
	const fallbackUrl = $derived(
		page.url.searchParams.has('eid')
			? `/track-event?eid=${page.url.searchParams.get('eid')}`
			: '/dashboard'
	);
</script>

<svelte:head>
	<title>Sign In - PriceTracker</title>
</svelte:head>

<ClerkLoaded>
	<div class="my-10 flex justify-center">
		<SignIn
			fallbackRedirectUrl={fallbackUrl}
			signUpFallbackRedirectUrl={fallbackUrl}
			signUpUrl={signupUrl}
		/>
	</div>
</ClerkLoaded>
