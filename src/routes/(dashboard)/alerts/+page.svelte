<script lang="ts">
	import { goto } from '$app/navigation';

	// Mock alert data
	const alerts = [
		{
			id: 1,
			type: 'price_drop',
			eventName: 'Taylor Swift | The Eras Tour',
			venue: 'BC Place, Vancouver',
			section: 'Floor Section A',
			oldPrice: 450,
			newPrice: 389,
			targetPrice: 400,
			timestamp: new Date('2026-02-06T10:30:00'),
			isNew: true
		},
		{
			id: 2,
			type: 'price_drop',
			eventName: 'The Weeknd - After Hours Til Dawn',
			venue: 'Rogers Arena, Vancouver',
			section: 'Lower Bowl 102',
			oldPrice: 285,
			newPrice: 249,
			targetPrice: 300,
			timestamp: new Date('2026-02-05T15:45:00'),
			isNew: false
		},
		{
			id: 3,
			type: 'target_reached',
			eventName: 'Drake - It\'s All a Blur Tour',
			venue: 'Climate Pledge Arena, Seattle',
			section: 'Upper Bowl 201',
			newPrice: 175,
			targetPrice: 200,
			timestamp: new Date('2026-02-04T09:20:00'),
			isNew: false
		}
	];

	function formatDate(date: Date) {
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const hours = Math.floor(diff / (1000 * 60 * 60));

		if (hours < 1) {
			const minutes = Math.floor(diff / (1000 * 60));
			return `${minutes}m ago`;
		} else if (hours < 24) {
			return `${hours}h ago`;
		} else {
			const days = Math.floor(hours / 24);
			return `${days}d ago`;
		}
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
	<title>Alerts - PriceTracker</title>
</svelte:head>

<div class="mx-auto w-full max-w-7xl px-4 pb-24">
	<!-- Header -->
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-black text-[#111218]">Price Alerts</h1>
			<p class="mt-1 text-sm text-[#616889]">Your notification history</p>
		</div>
		<button
			type="button"
			onclick={() => goto('/settings')}
			class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-[#616889] transition-colors hover:bg-gray-100"
		>
			<span class="material-symbols-outlined text-[20px]">settings</span>
			Settings
		</button>
	</div>

	<!-- Filter Tabs -->
	<div class="mb-6 flex gap-2 overflow-x-auto">
		<button
			type="button"
			class="flex h-9 shrink-0 items-center justify-center gap-x-1 rounded-full bg-primary px-4 text-xs font-semibold text-white"
		>
			<span>All Alerts</span>
		</button>
		<button
			type="button"
			class="flex h-9 shrink-0 items-center justify-center gap-x-1 rounded-full border border-[#dbdde6] bg-white px-4 text-xs font-medium text-[#111218]"
		>
			<span>Price Drops</span>
		</button>
		<button
			type="button"
			class="flex h-9 shrink-0 items-center justify-center gap-x-1 rounded-full border border-[#dbdde6] bg-white px-4 text-xs font-medium text-[#111218]"
		>
			<span>Target Reached</span>
		</button>
	</div>

	<!-- Alerts List -->
	<div class="space-y-3">
		{#each alerts as alert (alert.id)}
			<div class="overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md">
				<div class="flex items-start gap-4 p-4">
					<!-- Icon -->
					<div
						class="flex size-12 shrink-0 items-center justify-center rounded-lg {alert.type ===
						'target_reached'
							? 'bg-green-100 text-green-600'
							: 'bg-primary/10 text-primary'}"
					>
						<span class="material-symbols-outlined">
							{alert.type === 'target_reached' ? 'check_circle' : 'trending_down'}
						</span>
					</div>

					<!-- Content -->
					<div class="flex-1">
						<div class="mb-1 flex items-start justify-between gap-2">
							<h3 class="font-bold text-[#111218]">{alert.eventName}</h3>
							{#if alert.isNew}
								<span
									class="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
								>
									New
								</span>
							{/if}
						</div>
						<p class="mb-2 text-sm text-[#616889]">{alert.venue}</p>
						<p class="mb-3 text-xs font-medium uppercase tracking-wider text-primary">
							{alert.section}
						</p>

						<!-- Price Change -->
						<div class="mb-3 flex items-center gap-4">
							{#if alert.oldPrice}
								<div>
									<p class="text-xs text-[#616889]">Was</p>
									<p class="text-lg font-bold text-gray-400 line-through">
										{formatPrice(alert.oldPrice)}
									</p>
								</div>
								<span class="material-symbols-outlined text-2xl text-green-600">arrow_forward</span>
							{/if}
							<div>
								<p class="text-xs text-[#616889]">Now</p>
								<p class="text-lg font-bold text-green-600">{formatPrice(alert.newPrice)}</p>
							</div>
							{#if alert.targetPrice}
								<div class="ml-auto">
									<p class="text-xs text-[#616889]">Your Target</p>
									<p class="text-lg font-bold text-[#111218]">
										&lt;{formatPrice(alert.targetPrice)}
									</p>
								</div>
							{/if}
						</div>

						<!-- Footer -->
						<div class="flex items-center justify-between border-t border-gray-50 pt-3">
							<span class="text-xs text-[#616889]">{formatDate(alert.timestamp)}</span>
							<button
								type="button"
								onclick={() => goto(`/events/${alert.id}`)}
								class="flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
							>
								View Event
								<span class="material-symbols-outlined text-[16px]">arrow_forward</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Empty State (hidden when there are alerts) -->
	<!--
	<div class="flex flex-col items-center justify-center py-16 text-center">
		<div class="mb-4 flex size-20 items-center justify-center rounded-full bg-gray-100">
			<span class="material-symbols-outlined text-4xl text-gray-400">notifications_off</span>
		</div>
		<h3 class="mb-2 text-xl font-bold text-[#111218]">No alerts yet</h3>
		<p class="mb-6 max-w-sm text-sm text-[#616889]">
			Start tracking events and you'll see price drop notifications here.
		</p>
		<button
			type="button"
			onclick={() => goto('/add')}
			class="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white transition-colors hover:bg-primary/90"
		>
			<span class="material-symbols-outlined">add</span>
			Track Your First Event
		</button>
	</div>
	-->
</div>
