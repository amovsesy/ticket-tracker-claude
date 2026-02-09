<script lang="ts">
	import { page } from '$app/stores';
	import Alert from '$lib/components/shared/Alert.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Get initial values from URL
	const tabParam = $page.url.searchParams.get('tab');
	const initialQuery = $page.url.searchParams.get('q') || '';

	let activeTab = $state(tabParam === 'url' ? 'url' : 'search');
	let searchQuery = $state(initialQuery || null);
	let urlInput = $state('');
	let isLoading = $state(false);
	let errorMessage = $state('');

	async function handleImportUrl() {
		if (!urlInput.trim()) {
			errorMessage = 'Please paste a valid event URL';
			return;
		}

		isLoading = true;
		errorMessage = '';

		try {
			const response = await fetch('/api/scrape', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ url: urlInput.trim() })
			});

			const responseData = (await response.json()) as {
				success: boolean;
				event: { id: number };
				message?: string;
			};

			if (!response.ok) {
				errorMessage = responseData.message || 'Failed to import event';
				return;
			}

			// Success! Redirect to event detail page
			goto(`/events/${responseData.event.id}`);
		} catch (error) {
			console.error('Import error:', error);
			errorMessage = 'Failed to connect to server. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	function getPlatformColor(platform: string) {
		if (platform === 'ticketmaster') return 'bg-blue-100 text-blue-700';
		if (platform === 'stubhub') return 'bg-orange-100 text-orange-700';
		return 'bg-green-100 text-green-700';
	}
</script>

<svelte:head>
	<title>Add New Event - PriceTracker</title>
</svelte:head>

<div class="mx-auto w-full max-w-7xl px-4">
	<!-- Demo Mode Indicator -->
	{#if data.isDemoMode}
		<div class="pt-4">
			<Alert variant="warning" icon="🎭" title="Demo Mode Active">
				You are viewing sample search results. This is not real event data.
			</Alert>
		</div>
	{/if}

	<!-- Segmented Tabs -->
	<div class="flex py-3">
		<div class="flex h-11 w-full items-center justify-center rounded-xl bg-[#f0f1f4] p-1">
			<label
				class="flex h-full grow cursor-pointer items-center justify-center overflow-hidden rounded-lg px-2 text-sm leading-normal font-semibold text-[#616889] transition-all {activeTab ===
				'search'
					? 'text-primary bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)]'
					: ''}"
			>
				<span class="truncate">Search Events</span>
				<input
					type="radio"
					name="import-method"
					value="search"
					checked={activeTab === 'search'}
					onchange={() => (activeTab = 'search')}
					class="invisible w-0"
				/>
			</label>
			<label
				class="flex h-full grow cursor-pointer items-center justify-center overflow-hidden rounded-lg px-2 text-sm leading-normal font-semibold text-[#616889] transition-all {activeTab ===
				'url'
					? 'text-primary bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)]'
					: ''}"
			>
				<span class="truncate">Paste URL</span>
				<input
					type="radio"
					name="import-method"
					value="url"
					checked={activeTab === 'url'}
					onchange={() => (activeTab = 'url')}
					class="invisible w-0"
				/>
			</label>
		</div>
	</div>

	{#if activeTab === 'search'}
		<!-- Search Content -->
		<div class="py-2">
			<label class="flex h-12 w-full min-w-40 flex-col">
				<div class="flex h-full w-full flex-1 items-stretch rounded-xl shadow-sm">
					<div
						aria-hidden="true"
						class="flex items-center justify-center rounded-l-xl bg-[#f0f1f4] pl-4 text-[#616889]"
					>
						<span class="material-symbols-outlined">search</span>
					</div>
					<input
						bind:value={searchQuery}
						class="form-input flex h-full w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl border-none bg-[#f0f1f4] px-4 pl-2 text-base leading-normal font-normal text-[#111218] placeholder:text-[#616889] focus:ring-0 focus:outline-0"
						placeholder="Search Ticketmaster, StubHub..."
					/>
				</div>
			</label>
		</div>

		<!-- Results Section -->
		<div class="flex flex-1 flex-col pb-10">
			{#if data.searchResults.length > 0}
				<h3 class="pt-6 pb-2 text-lg leading-tight font-bold tracking-[-0.015em] text-[#111218]">
					Recent Results
				</h3>

				<!-- Event Cards - Responsive Grid -->
				<div class="grid grid-cols-1 gap-4 py-2 md:grid-cols-2 lg:grid-cols-3">
					{#each data.searchResults as event (event.id)}
						<div
							class="flex flex-col gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
						>
							<div class="flex items-start justify-between gap-4">
								<div class="flex flex-1 flex-col gap-1">
									<div class="mb-1 flex items-center gap-2">
										<span
											class="rounded px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase {getPlatformColor(
												event.platform
											)}"
										>
											{event.platform}
										</span>
									</div>
									<p class="text-base leading-tight font-bold text-[#111218]">{event.title}</p>
									<p class="text-sm leading-normal font-normal text-[#616889]">
										{event.date} • {event.venue}
									</p>
								</div>
								<div
									class="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat"
									style="background-image: url('{event.image}');"
								></div>
							</div>
							<button
								type="button"
								href={'/track-event?event=' + event.id}
								data-sveltekit-preload-data
								class="bg-primary hover:bg-primary/90 flex h-11 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg px-4 text-sm leading-normal font-semibold text-white transition-colors"
							>
								<span class="material-symbols-outlined text-[20px]">add_circle</span>
								<span class="truncate">Track This Event</span>
							</button>
						</div>
					{/each}
				</div>

				<!-- Supported Platforms -->
				<div class="mt-8 text-center">
					<p class="mb-4 text-xs font-medium tracking-widest text-[#616889] uppercase">
						Supported Platforms
					</p>
					<div
						class="flex justify-center gap-6 opacity-60 grayscale transition-all duration-300 hover:grayscale-0"
					>
						<div class="flex flex-col items-center gap-1">
							<span class="material-symbols-outlined text-2xl">confirmation_number</span>
							<span class="text-[10px]">Ticketmaster</span>
						</div>
						<div class="flex flex-col items-center gap-1">
							<span class="material-symbols-outlined text-2xl">local_activity</span>
							<span class="text-[10px]">StubHub</span>
						</div>
						<div class="flex flex-col items-center gap-1">
							<span class="material-symbols-outlined text-2xl">stadium</span>
							<span class="text-[10px]">SeatGeek</span>
						</div>
					</div>
				</div>
			{:else}
				<!-- Empty State for Search -->
				<div class="flex flex-col items-center justify-center py-16 text-center">
					<div class="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-[#f6f6f8]">
						<span class="material-symbols-outlined text-5xl text-[#616889]">search</span>
					</div>
					<h3 class="mb-2 text-2xl font-black text-[#111218]">No search results</h3>
					<p class="mb-6 max-w-md text-sm text-[#616889]">
						Try searching for an event or paste a direct URL from Ticketmaster, StubHub, or
						SeatGeek.
					</p>
					<button
						type="button"
						onclick={() => (activeTab = 'url')}
						class="bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-xl px-6 py-3 font-bold text-white shadow-sm transition-all hover:shadow-md"
					>
						<span class="material-symbols-outlined">link</span>
						Paste Event URL
					</button>
				</div>
			{/if}
		</div>
	{:else}
		<!-- URL Input View -->
		<div class="flex-1 py-6">
			<div class="rounded-xl bg-white p-6 shadow-sm">
				<h3 class="mb-4 text-lg font-bold text-[#111218]">Import via Link</h3>

				{#if errorMessage}
					<div class="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
						<div class="flex items-start gap-2">
							<span class="material-symbols-outlined text-base">error</span>
							<span>{errorMessage}</span>
						</div>
					</div>
				{/if}

				<div class="relative">
					<textarea
						bind:value={urlInput}
						disabled={isLoading}
						class="focus:ring-primary/50 h-32 w-full rounded-xl border-none bg-[#f0f1f4] p-4 text-sm text-[#111218] placeholder:text-[#616889] focus:ring-2 disabled:opacity-50"
						placeholder="Paste StubHub, Ticketmaster, or SeatGeek event URL here...&#10;&#10;Example:&#10;https://www.stubhub.com/taylor-swift-tickets/..."
					></textarea>
					<button
						type="button"
						onclick={() => {
							if (navigator.clipboard) {
								navigator.clipboard.readText().then((text) => {
									urlInput = text;
								});
							}
						}}
						disabled={isLoading}
						class="text-primary absolute top-3 right-3 rounded-md bg-white px-3 py-1 text-xs font-bold shadow-sm disabled:opacity-50"
					>
						PASTE
					</button>
				</div>

				<button
					type="button"
					onclick={handleImportUrl}
					disabled={isLoading || !urlInput.trim()}
					class="bg-primary shadow-primary/20 hover:bg-primary/90 disabled:hover:bg-primary mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl font-bold text-white shadow-lg transition-colors disabled:opacity-50"
				>
					{#if isLoading}
						<span class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span
						>
						<span>Importing Event...</span>
					{:else}
						<span class="material-symbols-outlined text-[20px]">download</span>
						<span>Import Event</span>
					{/if}
				</button>

				<!-- Info Section -->
				<div class="mt-6 rounded-lg bg-blue-50 p-4">
					<h4 class="mb-2 flex items-center gap-2 text-sm font-bold text-blue-900">
						<span class="material-symbols-outlined text-base">info</span>
						How it works
					</h4>
					<ul class="space-y-1 text-xs text-blue-700">
						<li>• Copy any event URL from supported platforms</li>
						<li>• We'll automatically fetch pricing and details</li>
						<li>• Set your target price to get notified</li>
					</ul>
				</div>
			</div>
		</div>
	{/if}
</div>
