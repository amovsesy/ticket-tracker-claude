<script lang="ts">
	import type { Snippet } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import ImpersonationBanner from '$lib/components/ImpersonationBanner.svelte';
	import type { LayoutData } from './$types';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
		rel="stylesheet"
	/>
	<style>
		.material-symbols-outlined {
			font-variation-settings:
				'FILL' 0,
				'wght' 400,
				'GRAD' 0,
				'opsz' 24;
		}
	</style>
</svelte:head>

<div class="relative min-h-screen bg-[#f6f6f8]">
	<!-- Impersonation Banner (if active) -->
	{#if data?.impersonating}
		<ImpersonationBanner userEmail={data.impersonating.targetEmail} />
	{/if}

	<Header />

	<!-- Main content area with sidebar offset on desktop -->
	<main class="pb-24 md:ml-64 md:pb-8">
		{@render children()}
	</main>

	<Navigation isAdmin={data?.isAdmin || false} />
</div>
