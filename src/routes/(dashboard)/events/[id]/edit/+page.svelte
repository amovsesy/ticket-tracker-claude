<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let targetPrice = $state(data.event.targetPrice.toString());
	let section = $state(data.event.section);
	let isPaused = $state(data.event.isPaused);
	let showDeleteConfirm = $state(false);

	function formatDate(dateString: string) {
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		}).format(new Date(dateString));
	}
</script>

<svelte:head>
	<title>Edit Tracking Settings - {data.event.eventName}</title>
</svelte:head>

<div class="min-h-screen bg-[#f6f6f8] pb-20 md:pb-8">
	<!-- Header -->
	<div class="border-b border-[#dbdde6] bg-white">
		<div class="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4">
			<a
				href={resolve('/events/{data.event.id}')}
				data-sveltekit-preload-data
				class="flex h-10 w-10 items-center justify-center rounded-lg text-[#111218] hover:bg-[#f6f6f8]"
			>
				<span class="material-symbols-outlined">arrow_back</span>
			</a>
			<h1 class="text-xl font-bold text-[#111218]">Edit Tracking Settings</h1>
		</div>
	</div>

	<div class="mx-auto max-w-7xl px-4 py-6">
		<!-- Event Info Card -->
		<div class="mb-6 overflow-hidden rounded-xl border border-[#dbdde6] bg-white p-6 shadow-sm">
			<div class="flex gap-4">
				<img
					src={data.event.imageUrl}
					alt={data.event.eventName}
					class="h-20 w-20 rounded-lg object-cover"
				/>
				<div class="flex-1">
					<h2 class="mb-2 text-lg font-bold text-[#111218]">{data.event.eventName}</h2>
					<div class="space-y-1 text-sm text-[#616889]">
						<div class="flex items-center gap-2">
							<span class="material-symbols-outlined text-base">location_on</span>
							{data.event.venue} · {data.event.location}
						</div>
						<div class="flex items-center gap-2">
							<span class="material-symbols-outlined text-base">calendar_today</span>
							{formatDate(data.event.date)}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Edit Form -->
		<form method="POST" action="?/update" use:enhance>
			<div class="mb-6 overflow-hidden rounded-xl border border-[#dbdde6] bg-white shadow-sm">
				<div class="border-b border-gray-100 px-6 py-4">
					<h3 class="text-lg font-bold text-[#111218]">Alert Settings</h3>
				</div>
				<div class="space-y-6 p-6">
					<!-- Target Price -->
					<div class="space-y-2">
						<label for="targetPrice" class="block text-sm font-semibold text-[#111218]">
							Target Price
						</label>
						<div class="flex items-center gap-2">
							<span class="text-xl font-bold text-[#111218]">$</span>
							<input
								id="targetPrice"
								name="targetPrice"
								type="number"
								step="0.01"
								min="0"
								bind:value={targetPrice}
								class="h-12 flex-1 rounded-xl border border-[#dbdde6] bg-white px-4 text-base text-[#111218] shadow-sm transition-all placeholder:text-[#616889] hover:shadow-md focus:border-[#1337ec] focus:ring-2 focus:ring-[#1337ec]/20 focus:outline-none"
								placeholder="250.00"
								required
							/>
						</div>
						<p class="text-xs text-[#616889]">
							You'll be notified when prices drop below this amount
						</p>
					</div>

					<!-- Section Preference -->
					<div class="space-y-2">
						<label for="section" class="block text-sm font-semibold text-[#111218]">
							Preferred Section
						</label>
						<select
							id="section"
							name="section"
							bind:value={section}
							class="h-12 w-full rounded-xl border border-[#dbdde6] bg-white px-4 text-base text-[#111218] shadow-sm transition-all hover:shadow-md focus:border-[#1337ec] focus:ring-2 focus:ring-[#1337ec]/20 focus:outline-none"
						>
							<option value="Any">Any Section</option>
							<option value="Floor">Floor</option>
							<option value="Lower Bowl">Lower Bowl</option>
							<option value="Upper Bowl">Upper Bowl</option>
						</select>
						<p class="text-xs text-[#616889]">Track prices for specific seating sections</p>
					</div>

					<!-- Pause Notifications -->
					<div class="flex items-center justify-between rounded-lg border border-[#dbdde6] p-4">
						<div class="flex-1">
							<label for="isPaused" class="block text-sm font-semibold text-[#111218]">
								Pause Notifications
							</label>
							<p class="text-sm text-[#616889]">Temporarily stop receiving alerts for this event</p>
						</div>
						<input
							type="checkbox"
							id="isPaused"
							name="isPaused"
							bind:checked={isPaused}
							class="text-primary focus:ring-primary/20 h-5 w-5 rounded border-[#dbdde6] focus:ring-2"
						/>
					</div>
					<input type="hidden" name="isPaused" value={isPaused.toString()} />
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="space-y-3">
				<button
					type="submit"
					class="bg-primary hover:bg-primary/90 flex h-12 w-full items-center justify-center rounded-lg text-base font-bold text-white"
				>
					Save Changes
				</button>
				<a
					href={resolve('/events/{data.event.id}')}
					data-sveltekit-preload-data
					class="flex h-12 w-full items-center justify-center rounded-lg border border-[#dbdde6] bg-white text-base font-semibold text-[#111218] hover:bg-[#f6f6f8]"
				>
					Cancel
				</a>
			</div>
		</form>

		<!-- Delete Section -->
		<div
			class="mt-6 overflow-hidden rounded-xl bg-white shadow-sm"
			style="border: 2px solid #fecaca;"
		>
			<div class="px-6 py-4" style="background-color: #fef2f2; border-bottom: 2px solid #fecaca;">
				<h3 class="text-lg font-bold" style="color: #dc2626;">Danger Zone</h3>
			</div>
			<div class="p-6">
				<p class="mb-4 text-sm font-medium text-[#111218]">
					Stop tracking this event and delete all associated price history. This action cannot be
					undone.
				</p>

				{#if !showDeleteConfirm}
					<button
						type="button"
						onclick={() => (showDeleteConfirm = true)}
						class="flex h-12 w-full items-center justify-center rounded-lg text-base font-bold"
						style="background-color: #dc2626; color: white;"
					>
						Delete Tracker
					</button>
				{:else}
					<div class="rounded-lg p-4" style="background-color: #fef2f2; border: 2px solid #fecaca;">
						<p class="mb-2 text-base font-bold" style="color: #dc2626;">Are you sure?</p>
						<p class="mb-4 text-sm font-medium text-[#111218]">
							This will permanently delete the tracker and all price history.
						</p>
						<div class="flex gap-3">
							<form method="POST" action="?/delete" use:enhance class="flex-1">
								<button
									type="submit"
									class="flex h-11 w-full items-center justify-center rounded-lg text-base font-bold"
									style="background-color: #dc2626; color: white;"
								>
									Yes, Delete Tracker
								</button>
							</form>
							<button
								type="button"
								onclick={() => (showDeleteConfirm = false)}
								class="flex h-11 flex-1 items-center justify-center rounded-lg border-2 border-[#dbdde6] bg-white text-base font-semibold text-[#111218]"
							>
								Cancel
							</button>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<BottomNav />
