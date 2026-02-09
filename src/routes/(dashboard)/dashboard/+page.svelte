<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';
	import Alert from '$lib/components/shared/Alert.svelte';
	import FilterChip from '$lib/components/shared/FilterChip.svelte';
	import EventCard from '$lib/components/shared/EventCard.svelte';
	import SearchInput from '$lib/components/admin/SearchInput.svelte';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');
	let activeFilter = $state('all');
</script>

<svelte:head>
	<title>My Tracker - PriceTracker</title>
</svelte:head>

<div class="mx-auto w-full max-w-7xl">
	<!-- Demo Mode Indicator -->
	{#if data.isDemoMode}
		<div class="mx-4 mt-4">
			<Alert variant="warning" icon="🎭" title="Demo Mode Active">
				You are viewing sample data. This is not real tracking information.
			</Alert>
		</div>
	{/if}

	<!-- Search Bar -->
	<div class="px-4 py-4">
		<SearchInput bind:value={searchQuery} placeholder="Search tracked events..." />
	</div>

	<!-- Filter Chips -->
	<div class="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2">
		<FilterChip active={activeFilter === 'all'} onclick={() => (activeFilter = 'all')}>
			All Events
		</FilterChip>
		<FilterChip
			active={activeFilter === 'drops'}
			onclick={() => (activeFilter = 'drops')}
			icon="keyboard_arrow_down"
		>
			Price Drops
		</FilterChip>
		<FilterChip
			active={activeFilter === 'concerts'}
			onclick={() => (activeFilter = 'concerts')}
			icon="keyboard_arrow_down"
		>
			Concerts
		</FilterChip>
	</div>

	<!-- Event Cards -->
	<div class="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
		{#each data.trackedEvents as event (event.id)}
			<EventCard {event} href={resolve(`/events/${event.id}`)} />
		{:else}
			<!-- Empty State -->
			<div class="col-span-full flex flex-col items-center justify-center py-16 text-center">
				<div class="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-[#f6f6f8]">
					<span class="material-symbols-outlined text-5xl text-[#616889]">confirmation_number</span>
				</div>
				<h3 class="mb-2 text-2xl font-black text-[#111218]">No tracked events yet</h3>
				<p class="mb-6 max-w-md text-sm text-[#616889]">
					Start tracking ticket prices for your favorite events and get notified when prices drop
					below your target.
				</p>
				<a
					href={resolve('/add')}
					data-sveltekit-preload-data
					class="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
				>
					<span class="material-symbols-outlined">add</span>
					Track Your First Event
				</a>
			</div>
		{/each}
	</div>
</div>
