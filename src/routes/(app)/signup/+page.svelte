<script lang="ts">
	import SignUp from '$lib/components/clerk/SignUp.svelte';
	import ClerkLoaded from '$lib/components/clerk/ClerkLoaded.svelte';

	import { page } from '$app/state';

	const signInUrl = $derived(
		'/login' + (page.url.searchParams.has('eid') ? `?eid=${page.url.searchParams.get('eid')}` : '')
	);
	const fallbackUrl = $derived(
		page.url.searchParams.has('eid')
			? `/track-event?eid=${page.url.searchParams.get('eid')}`
			: '/dashboard'
	);
</script>

<ClerkLoaded>
	<div class="my-10 flex justify-center">
		<SignUp fallbackRedirectUrl={fallbackUrl} {signInUrl} />
	</div>
</ClerkLoaded>
