<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let showDeleteConfirm = $state(false);

	function formatDate(date: Date | null): string {
		if (!date) return 'N/A';
		return new Date(date).toLocaleDateString();
	}

	function formatDateTime(date: Date | null): string {
		if (!date) return 'N/A';
		return new Date(date).toLocaleString();
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
	}

	function formatDateForInput(date: Date | null): string {
		if (!date) return '';
		const d = new Date(date);
		return d.toISOString().slice(0, 16);
	}
</script>

<svelte:head>
	<title>{data.event.name} - Edit Event</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<a
			href={resolve('/admin/events')}
			class="inline-flex items-center text-[#616889] hover:text-[#111218]"
			data-sveltekit-preload-data
		>
			<span class="mr-2">←</span>
			Back to Events
		</a>
	</div>

	<!-- Event Header -->
	<div class="rounded-lg border border-[#dbdde6] bg-white p-6">
		<div class="flex items-start justify-between">
			<div>
				<h1 class="text-2xl font-bold text-[#111218]">{data.event.name}</h1>
				<p class="mt-1 text-[#616889]">
					{data.event.venue} • {data.event.location} • {formatDate(data.event.date)}
				</p>
			</div>
			<div class="flex gap-2">
				<a
					href={resolve('/events/{data.event.id}')}
					data-sveltekit-preload-data
					class="rounded-lg border border-[#dbdde6] px-4 py-2 transition-colors hover:bg-[#f6f6f8]"
				>
					View Public Page
				</a>
				<button
					onclick={() => (showDeleteConfirm = true)}
					class="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
				>
					Delete Event
				</button>
			</div>
		</div>

		<div class="mt-4 flex gap-4">
			<div class="rounded-lg bg-[#f6f6f8] px-4 py-2">
				<p class="text-xs text-[#616889]">Tracking Users</p>
				<p class="text-lg font-bold text-[#111218]">{data.trackingUsersCount}</p>
			</div>
			<div class="rounded-lg bg-[#f6f6f8] px-4 py-2">
				<p class="text-xs text-[#616889]">Platforms</p>
				<p class="text-lg font-bold text-[#111218]">{data.platforms.length}</p>
			</div>
			<div class="rounded-lg bg-[#f6f6f8] px-4 py-2">
				<p class="text-xs text-[#616889]">Price Records</p>
				<p class="text-lg font-bold text-[#111218]">{data.prices.length}</p>
			</div>
		</div>
	</div>

	<!-- Edit Event Form -->
	<div class="rounded-lg border border-[#dbdde6] bg-white p-6">
		<h2 class="mb-4 text-lg font-bold text-[#111218]">Edit Event Details</h2>

		<form method="POST" action="?/update" use:enhance class="space-y-4">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<label for="name" class="mb-1 block text-sm font-medium text-[#111218]">
						Event Name
					</label>
					<input
						type="text"
						id="name"
						name="name"
						value={data.event.name}
						required
						class="w-full rounded-lg border border-[#dbdde6] px-4 py-2 focus:ring-2 focus:ring-[#1337ec] focus:outline-none"
					/>
				</div>

				<div>
					<label for="venue" class="mb-1 block text-sm font-medium text-[#111218]"> Venue </label>
					<input
						type="text"
						id="venue"
						name="venue"
						value={data.event.venue}
						required
						class="w-full rounded-lg border border-[#dbdde6] px-4 py-2 focus:ring-2 focus:ring-[#1337ec] focus:outline-none"
					/>
				</div>

				<div>
					<label for="location" class="mb-1 block text-sm font-medium text-[#111218]">
						Location
					</label>
					<input
						type="text"
						id="location"
						name="location"
						value={data.event.location}
						required
						class="w-full rounded-lg border border-[#dbdde6] px-4 py-2 focus:ring-2 focus:ring-[#1337ec] focus:outline-none"
					/>
				</div>

				<div>
					<label for="date" class="mb-1 block text-sm font-medium text-[#111218]">
						Event Date
					</label>
					<input
						type="datetime-local"
						id="date"
						name="date"
						value={formatDateForInput(data.event.date)}
						required
						class="w-full rounded-lg border border-[#dbdde6] px-4 py-2 focus:ring-2 focus:ring-[#1337ec] focus:outline-none"
					/>
				</div>

				<div>
					<label for="category" class="mb-1 block text-sm font-medium text-[#111218]">
						Category
					</label>
					<select
						id="category"
						name="category"
						value={data.event.category}
						required
						class="w-full rounded-xl border border-[#dbdde6] bg-white px-4 py-2 text-sm text-[#111218] shadow-sm transition-all hover:shadow-md focus:border-[#1337ec] focus:ring-2 focus:ring-[#1337ec]/20 focus:outline-none"
					>
						<option value="concerts">Concerts</option>
						<option value="sports">Sports</option>
						<option value="theater">Theater</option>
						<option value="other">Other</option>
					</select>
				</div>

				<div>
					<label for="imageUrl" class="mb-1 block text-sm font-medium text-[#111218]">
						Image URL
					</label>
					<input
						type="url"
						id="imageUrl"
						name="imageUrl"
						value={data.event.imageUrl || ''}
						class="w-full rounded-lg border border-[#dbdde6] px-4 py-2 focus:ring-2 focus:ring-[#1337ec] focus:outline-none"
					/>
				</div>
			</div>

			<div>
				<label for="description" class="mb-1 block text-sm font-medium text-[#111218]">
					Description
				</label>
				<textarea
					id="description"
					name="description"
					rows="3"
					value={data.event.description || ''}
					class="w-full rounded-lg border border-[#dbdde6] px-4 py-2 focus:ring-2 focus:ring-[#1337ec] focus:outline-none"
				></textarea>
			</div>

			<button
				type="submit"
				class="rounded-lg bg-[#1337ec] px-6 py-2 font-medium text-white transition-colors hover:bg-[#0f2ab3]"
			>
				Save Changes
			</button>
		</form>
	</div>

	<!-- Platform Sources -->
	<div class="rounded-lg border border-[#dbdde6] bg-white p-6">
		<h2 class="mb-4 text-lg font-bold text-[#111218]">Platform Sources</h2>

		{#if data.platforms.length === 0}
			<p class="text-[#616889]">No platform sources configured for this event.</p>
		{:else}
			<div class="space-y-3">
				{#each data.platforms as platform (platform.id)}
					<div class="flex items-center justify-between rounded-lg bg-[#f6f6f8] p-4">
						<div>
							<p class="text-sm font-medium text-[#111218] capitalize">{platform.platform}</p>
							<a
								href={resolve(platform.url)}
								data-sveltekit-preload-data
								target="_blank"
								rel="noopener noreferrer"
								class="text-xs text-[#1337ec] hover:underline"
							>
								{platform.url}
							</a>
						</div>
						<button
							onclick={() => {
								showAddPrice = true;
							}}
							class="rounded-lg border border-[#dbdde6] px-3 py-1 text-sm transition-colors hover:bg-white"
						>
							Add Price
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Price History -->
	<div class="rounded-lg border border-[#dbdde6] bg-white">
		<div class="border-b border-[#dbdde6] p-6">
			<h2 class="text-lg font-bold text-[#111218]">Price History</h2>
		</div>
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-[#f6f6f8]">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-[#616889] uppercase"
						>
							Platform
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-[#616889] uppercase"
						>
							Price
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-[#616889] uppercase"
						>
							Section
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-[#616889] uppercase"
						>
							Scraped At
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-[#dbdde6]">
					{#if data.prices.length === 0}
						<tr>
							<td colspan="4" class="px-6 py-8 text-center text-[#616889]">
								No price history available
							</td>
						</tr>
					{:else}
						{#each data.prices as price (price.id)}
							<tr class="transition-colors hover:bg-[#f6f6f8]">
								<td class="px-6 py-4">
									<span class="text-sm font-medium text-[#111218] capitalize">
										{price.platform}
									</span>
								</td>
								<td class="px-6 py-4 text-sm font-bold text-[#111218]">
									{formatCurrency(price.price)}
								</td>
								<td class="px-6 py-4 text-sm text-[#616889]">{price.section || 'General'}</td>
								<td class="px-6 py-4 text-sm text-[#616889]">
									{formatDateTime(price.scrapedAt)}
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- Delete Confirmation Modal -->
{#if showDeleteConfirm}
	<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
		<div class="mx-4 w-full max-w-md rounded-lg bg-white p-6">
			<h3 class="mb-2 text-lg font-bold text-[#111218]">Delete Event?</h3>
			<p class="mb-4 text-sm text-[#616889]">
				This will permanently delete <strong>{data.event.name}</strong> and all related data including:
			</p>
			<ul class="mb-4 list-inside list-disc text-sm text-[#616889]">
				<li>{data.trackingUsersCount} users tracking this event</li>
				<li>{data.platforms.length} platform sources</li>
				<li>{data.prices.length} price records</li>
			</ul>
			<p class="mb-6 text-sm text-red-600">This action cannot be undone.</p>

			<div class="flex gap-3">
				<form method="POST" action="?/delete" use:enhance class="flex-1">
					<button
						type="submit"
						class="w-full rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
					>
						Delete Permanently
					</button>
				</form>
				<button
					onclick={() => (showDeleteConfirm = false)}
					class="flex-1 rounded-lg border border-[#dbdde6] px-4 py-2 font-medium text-[#616889] transition-colors hover:bg-[#f6f6f8]"
				>
					Cancel
				</button>
			</div>
		</div>
	</div>
{/if}
