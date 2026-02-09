<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');
	let categoryFilter = $state<'all' | 'sports' | 'concerts' | 'theater' | 'other'>('all');

	let filteredEvents = $derived(
		data.events.filter((event) => {
			const matchesSearch =
				event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
				event.location.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
			return matchesSearch && matchesCategory;
		})
	);

	function formatDate(date: Date | null): string {
		if (!date) return 'N/A';
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Events - Admin Panel</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-[#111218]">Events</h1>
			<p class="mt-2 text-[#616889]">Manage all events and pricing data</p>
		</div>
		<a
			href={resolve('/admin/events/new')}
			data-sveltekit-preload-data
			class="rounded-lg bg-[#1337ec] px-4 py-2 font-medium text-white transition-colors hover:bg-[#0f2ab3]"
		>
			+ Create Event
		</a>
	</div>

	<!-- Filters -->
	<div class="rounded-lg border border-[#dbdde6] bg-white p-4">
		<div class="flex flex-wrap gap-4">
			<!-- Search -->
			<div class="min-w-[300px] flex-1">
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search by name, venue, or location..."
					class="w-full rounded-lg border border-[#dbdde6] px-4 py-2 focus:ring-2 focus:ring-[#1337ec] focus:outline-none"
				/>
			</div>

			<!-- Category Filter -->
			<select
				bind:value={categoryFilter}
				class="rounded-xl border border-[#dbdde6] bg-white px-4 py-2 text-sm text-[#111218] shadow-sm transition-all hover:shadow-md focus:border-[#1337ec] focus:ring-2 focus:ring-[#1337ec]/20 focus:outline-none"
			>
				<option value="all">All Categories</option>
				<option value="sports">Sports</option>
				<option value="concerts">Concerts</option>
				<option value="theater">Theater</option>
				<option value="other">Other</option>
			</select>
		</div>
	</div>

	<!-- Stats Summary -->
	<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
		<div class="rounded-lg border border-[#dbdde6] bg-white p-4">
			<p class="text-sm text-[#616889]">Total Events</p>
			<p class="text-2xl font-bold text-[#111218]">{filteredEvents.length}</p>
		</div>
		<div class="rounded-lg border border-[#dbdde6] bg-white p-4">
			<p class="text-sm text-[#616889]">Sports</p>
			<p class="text-2xl font-bold text-[#111218]">
				{filteredEvents.filter((e) => e.category === 'sports').length}
			</p>
		</div>
		<div class="rounded-lg border border-[#dbdde6] bg-white p-4">
			<p class="text-sm text-[#616889]">Concerts</p>
			<p class="text-2xl font-bold text-[#111218]">
				{filteredEvents.filter((e) => e.category === 'concerts').length}
			</p>
		</div>
	</div>

	<!-- Events Table -->
	<div class="overflow-hidden rounded-lg border border-[#dbdde6] bg-white">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-[#f6f6f8]">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-[#616889] uppercase"
						>
							Event
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-[#616889] uppercase"
						>
							Venue
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-[#616889] uppercase"
						>
							Date
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-[#616889] uppercase"
						>
							Category
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-[#616889] uppercase"
						>
							Tracking Users
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-[#616889] uppercase"
						>
							Platforms
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-[#616889] uppercase"
						>
							Actions
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-[#dbdde6]">
					{#if filteredEvents.length === 0}
						<tr>
							<td colspan="7" class="px-6 py-8 text-center text-[#616889]">
								{#if data.events.length === 0}
									No events yet. Create your first event!
								{:else}
									No events found matching your search.
								{/if}
							</td>
						</tr>
					{:else}
						{#each filteredEvents as event (event.id)}
							<tr class="transition-colors hover:bg-[#f6f6f8]">
								<td class="px-6 py-4">
									<div class="flex items-center gap-3">
										{#if event.imageUrl}
											<img
												src={event.imageUrl}
												alt={event.name}
												class="h-12 w-12 rounded object-cover"
											/>
										{/if}
										<div>
											<p class="text-sm font-medium text-[#111218]">{event.name}</p>
											<p class="text-xs text-[#616889]">{event.location}</p>
										</div>
									</div>
								</td>
								<td class="px-6 py-4 text-sm text-[#616889]">{event.venue}</td>
								<td class="px-6 py-4 text-sm text-[#616889]">{formatDate(event.date)}</td>
								<td class="px-6 py-4">
									<span
										class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {event.category ===
										'sports'
											? 'bg-blue-100 text-blue-800'
											: event.category === 'concerts'
												? 'bg-purple-100 text-purple-800'
												: event.category === 'theater'
													? 'bg-pink-100 text-pink-800'
													: 'bg-gray-100 text-gray-800'}"
									>
										{event.category}
									</span>
								</td>
								<td class="px-6 py-4 text-sm text-[#111218]">{event.trackingUsersCount}</td>
								<td class="px-6 py-4 text-sm text-[#111218]">{event.platformsCount}</td>
								<td class="px-6 py-4 text-sm">
									<div class="flex gap-2">
										<a
											href={resolve('/admin/events/{event.id}')}
											data-sveltekit-preload-data
											class="font-medium text-[#1337ec] hover:underline"
										>
											Edit
										</a>
										<a
											href={resolve('/events/{event.id}')}
											class="text-[#616889] hover:underline"
											data-sveltekit-preload-data
										>
											View
										</a>
									</div>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>
