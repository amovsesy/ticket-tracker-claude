<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');
	let activeFilter = $state('all');

	function formatDate(date: Date) {
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
		}).format(new Date(date));
	}

	function formatPrice(price: number) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0
		}).format(price);
	}
</script>

<svelte:head>
	<title>My Tracker - PriceTracker</title>
</svelte:head>

<div class="mx-auto w-full max-w-7xl">
		<!-- Search Bar -->
		<div class="px-4 py-4">
			<label class="flex h-11 w-full min-w-40 flex-col">
				<div
					class="flex h-full w-full flex-1 items-stretch rounded-xl border border-[#dbdde6] shadow-sm"
				>
					<div class="flex items-center justify-center rounded-l-xl bg-white pl-4 text-[#616889]">
						<span class="material-symbols-outlined text-xl">search</span>
					</div>
					<input
						bind:value={searchQuery}
						class="form-input flex h-full w-full min-w-0 flex-1 rounded-r-xl border-none bg-white px-3 text-sm font-normal text-[#111218] placeholder:text-[#616889] focus:outline-0 focus:ring-0"
						placeholder="Search tracked events..."
					/>
				</div>
			</label>
		</div>

		<!-- Filter Chips -->
		<div class="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2">
			<button
				type="button"
				onclick={() => (activeFilter = 'all')}
				class={activeFilter === 'all'
					? 'flex h-9 shrink-0 items-center justify-center gap-x-1 rounded-full bg-primary px-4 text-xs font-semibold text-white'
					: 'flex h-9 shrink-0 items-center justify-center gap-x-1 rounded-full border border-[#dbdde6] bg-white px-4 text-xs font-medium text-[#111218]'}
			>
				<span>All Events</span>
			</button>
			<button
				type="button"
				onclick={() => (activeFilter = 'drops')}
				class="flex h-9 shrink-0 items-center justify-center gap-x-1 rounded-full border border-[#dbdde6] bg-white px-4 text-xs font-medium text-[#111218]"
			>
				<span>Price Drops</span>
				<span class="material-symbols-outlined text-sm">keyboard_arrow_down</span>
			</button>
			<button
				type="button"
				onclick={() => (activeFilter = 'concerts')}
				class="flex h-9 shrink-0 items-center justify-center gap-x-1 rounded-full border border-[#dbdde6] bg-white px-4 text-xs font-medium text-[#111218]"
			>
				<span>Concerts</span>
				<span class="material-symbols-outlined text-sm">keyboard_arrow_down</span>
			</button>
		</div>

		<!-- Event Cards -->
		<div class="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
			{#each data.trackedEvents as event (event.id)}
				<!-- Event Card -->
				<div
					class="flex flex-col overflow-hidden rounded-xl border border-[#dbdde6] bg-white shadow-sm"
				>
					<!-- Event Image -->
					<div
						class="relative aspect-[21/9] w-full bg-cover bg-center bg-no-repeat"
						style="background-image: url('{event.imageUrl}');"
					>
						{#if event.percentageChange < 0}
							<div
								class="absolute right-2 top-2 rounded-full bg-green-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
							>
								Price Drop
							</div>
						{/if}
					</div>

					<!-- Card Content -->
					<div class="flex flex-col gap-3 p-4">
						<div>
							<p class="mb-1 text-[10px] font-bold uppercase tracking-wider text-primary">
								{event.section}
							</p>
							<h3 class="text-base font-bold leading-tight text-[#111218]">{event.eventName}</h3>
							<p class="mt-1 text-xs text-[#616889]">
								{event.venue} • {formatDate(event.date)}
							</p>
						</div>

						<!-- Price Stats -->
						<div class="flex gap-4 border-t border-gray-100 pt-2">
							<div class="flex-1">
								<p class="text-[10px] font-semibold uppercase text-[#616889]">Threshold</p>
								<p class="text-lg font-bold text-[#111218]">&lt;{formatPrice(event.targetPrice)}</p>
							</div>
							<div class="flex-1">
								<p class="text-[10px] font-semibold uppercase text-[#616889]">Lowest</p>
								<div class="flex items-center gap-1">
									<p
										class="text-lg font-bold {event.percentageChange < 0
											? 'text-green-600'
											: 'text-[#111218]'}"
									>
										{formatPrice(event.currentLowestPrice)}
									</p>
									{#if event.percentageChange !== 0}
										<span
											class="rounded px-1 text-[10px] font-bold {event.percentageChange < 0
												? 'bg-green-50 text-green-600'
												: 'bg-red-50 text-red-500'}"
										>
											{event.percentageChange > 0 ? '+' : ''}{event.percentageChange.toFixed(0)}%
										</span>
									{/if}
								</div>
							</div>
						</div>

						<!-- Sparkline Chart -->
						<div class="flex h-10 w-full items-end gap-[2px] pt-1">
							{#each event.priceHistory as price, i (i)}
								{@const isLast = i === event.priceHistory.length - 1}
								{@const minPrice = Math.min(...event.priceHistory)}
								{@const maxPrice = Math.max(...event.priceHistory)}
								{@const height = maxPrice === minPrice ? 50 : ((maxPrice - price) / (maxPrice - minPrice)) * 100}
								<div
									class="flex-1 rounded-t-sm {isLast
										? event.percentageChange < 0
											? 'bg-primary'
											: 'bg-gray-400'
										: event.percentageChange < 0
											? 'bg-primary/20'
											: 'bg-gray-200'}"
									style="height: {Math.max(height, 20)}%"
								></div>
							{/each}
						</div>
						<p class="text-center text-[10px] text-[#616889]">7-day price trend</p>

						<!-- Action Button -->
						{#if event.percentageChange < 0}
							<button
								type="button"
								onclick={() => goto(`/events/${event.id}`)}
								class="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-bold text-white"
							>
								<span>View Deals</span>
								<span class="material-symbols-outlined text-sm">open_in_new</span>
							</button>
						{:else}
							<button
								type="button"
								onclick={() => goto(`/events/${event.id}/edit`)}
								class="mt-2 w-full rounded-lg border border-primary py-2.5 text-sm font-bold text-primary"
							>
								Manage Trackers
							</button>
						{/if}
					</div>
				</div>
			{/each}
		</div>
</div>
