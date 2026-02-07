<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	// Get initial values from URL
	const tabParam = $page.url.searchParams.get('tab');
	const initialQuery = $page.url.searchParams.get('q') || '';

	let activeTab = $state(tabParam === 'url' ? 'url' : 'search');
	let searchQuery = $state(initialQuery || 'Taylor Swift');
	let urlInput = $state('');

	// Mock search results
	const mockResults = [
		{
			id: 1,
			title: 'Taylor Swift | The Eras Tour',
			date: 'Dec 08',
			venue: 'BC Place, Vancouver',
			platform: 'ticketmaster',
			image:
				'https://lh3.googleusercontent.com/aida-public/AB6AXuBIAw2ws9OtCtHYh7Y1fwZNXEDTux46Sytza1qT50cY1xlH70GoGAfOZPaOYVdwShvoxVQqklNtkQ_sMrbT7ceS_XdNUeBbcnPc_ixhNdPV5NlAuoSKMgZ3gu55TbFY4gbwSrfyYE-OjaXlyjn-IMlID0y9hublnEvyeyrfu-1sagK204bSh6haELTMjmDUplS7PrGcwPzOAUcrPOCHC8oNDpPn5vBvPIMVcMGQWIcU83PstArY3Msz_65M6gyQCRn0LNmji_KBSQo'
		},
		{
			id: 2,
			title: 'The Eras Tour - Resale',
			date: 'Dec 07',
			venue: 'BC Place, Vancouver',
			platform: 'stubhub',
			image:
				'https://lh3.googleusercontent.com/aida-public/AB6AXuBSAScACo4Tutj41haMjejB-lnuh0nDB6Hq7SgJZ6dvyJ_49rQq3CUHCSqrrRMQbj1Pu-ARYb6weIgj9oQDF688Wl3rRw4VSZ8MItDqP8llMLCs2r6l9_RTBFIlqHzp_jci9MNE5Lrz0DjlMFUYd4BAYibgdtxk1zrPOB-MujQqWkUD_SxyI2QBXOw9O_bWweoMs8WL7-O95qutSNocTD8DAJT2OJYEXk04lF2BLYqqQV7EiY1UsdrYc58aKnn4d9QwHlfFNmGQBiE'
		}
	];

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
	<!-- Segmented Tabs -->
	<div class="flex py-3">
		<div class="flex h-11 w-full items-center justify-center rounded-xl bg-[#f0f1f4] p-1">
			<label
				class="flex h-full grow cursor-pointer items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-semibold leading-normal text-[#616889] transition-all {activeTab ===
				'search'
					? 'bg-white text-primary shadow-[0_2px_4px_rgba(0,0,0,0.1)]'
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
				class="flex h-full grow cursor-pointer items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-semibold leading-normal text-[#616889] transition-all {activeTab ===
				'url'
					? 'bg-white text-primary shadow-[0_2px_4px_rgba(0,0,0,0.1)]'
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
							class="form-input flex h-full w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl border-none bg-[#f0f1f4] px-4 pl-2 text-base font-normal leading-normal text-[#111218] placeholder:text-[#616889] focus:outline-0 focus:ring-0"
							placeholder="Search Ticketmaster, StubHub..."
						/>
					</div>
				</label>
		</div>

		<!-- Results Section -->
		<div class="flex flex-1 flex-col pb-10">
			<h3 class="pb-2 pt-6 text-lg font-bold leading-tight tracking-[-0.015em] text-[#111218]">
					Recent Results
				</h3>

				<!-- Event Cards - Responsive Grid -->
				<div class="grid grid-cols-1 gap-4 py-2 md:grid-cols-2 lg:grid-cols-3">
					{#each mockResults as event (event.id)}
						<div
							class="flex flex-col gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
						>
							<div class="flex items-start justify-between gap-4">
								<div class="flex flex-1 flex-col gap-1">
									<div class="mb-1 flex items-center gap-2">
										<span
											class="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider {getPlatformColor(
												event.platform
											)}"
										>
											{event.platform}
										</span>
									</div>
									<p class="text-base font-bold leading-tight text-[#111218]">{event.title}</p>
									<p class="text-sm font-normal leading-normal text-[#616889]">
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
								onclick={() => goto('/track-event?event=' + event.id)}
								class="flex h-11 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary px-4 text-sm font-semibold leading-normal text-white transition-colors hover:bg-primary/90"
							>
								<span class="material-symbols-outlined text-[20px]">add_circle</span>
								<span class="truncate">Track This Event</span>
							</button>
						</div>
					{/each}
				</div>

				<!-- Supported Platforms -->
				<div class="mt-8 text-center">
					<p class="mb-4 text-xs font-medium uppercase tracking-widest text-[#616889]">
						Supported Platforms
					</p>
					<div class="flex justify-center gap-6 opacity-60 transition-all duration-300 grayscale hover:grayscale-0">
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
		</div>
	{:else}
		<!-- URL Input View -->
		<div class="flex-1 py-6">
			<div class="rounded-xl bg-white p-6 shadow-sm">
					<h3 class="mb-4 text-lg font-bold text-[#111218]">Import via Link</h3>
					<div class="relative">
						<textarea
							bind:value={urlInput}
							class="h-32 w-full rounded-xl border-none bg-[#f0f1f4] p-4 text-sm placeholder:text-[#616889] focus:ring-2 focus:ring-primary/50"
							placeholder="Paste StubHub or SeatGeek event URL here..."
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
							class="absolute right-3 top-3 rounded-md bg-white px-3 py-1 text-xs font-bold text-primary shadow-sm"
						>
							PASTE
						</button>
					</div>
					<button
						type="button"
						onclick={() => alert('URL parsing will be implemented in Phase 4!')}
						class="mt-4 h-12 w-full rounded-xl bg-primary font-bold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90"
					>
						Import Event
					</button>
			</div>
		</div>
	{/if}
</div>
