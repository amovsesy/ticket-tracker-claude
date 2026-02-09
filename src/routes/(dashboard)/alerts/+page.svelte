<script lang="ts">
	import { resolve } from '$app/paths';
	import FilterChip from '$lib/components/shared/FilterChip.svelte';
	import Alert from '$lib/components/shared/Alert.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let activeFilter = $state<'all' | 'price_drop' | 'target_reached'>('all');

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

	// Filter alerts based on active filter
	const filteredAlerts = $derived(
		activeFilter === 'all'
			? data.alerts
			: data.alerts.filter((alert) => alert.type === activeFilter)
	);
</script>

<svelte:head>
	<title>Alerts - PriceTracker</title>
</svelte:head>

<div class="mx-auto w-full max-w-7xl px-4 pb-24">
	<!-- Demo Mode Indicator -->
	{#if data.isDemoMode}
		<div class="mb-4">
			<Alert variant="warning" icon="🎭" title="Demo Mode Active">
				You are viewing sample alert data. This is not real notification history.
			</Alert>
		</div>
	{/if}

	<!-- Header -->
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-black text-[#111218]">Price Alerts</h1>
			<p class="mt-1 text-sm text-[#616889]">Your notification history</p>
		</div>
		<a
			href={resolve('/settings')}
			data-sveltekit-preload-data
			class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-[#616889] transition-colors hover:bg-gray-100"
		>
			<span class="material-symbols-outlined text-[20px]">settings</span>
			Settings
		</a>
	</div>

	<!-- Filter Tabs -->
	<div class="mb-6 flex gap-2 overflow-x-auto">
		<FilterChip active={activeFilter === 'all'} onclick={() => (activeFilter = 'all')}>
			All Alerts
		</FilterChip>
		<FilterChip
			active={activeFilter === 'price_drop'}
			onclick={() => (activeFilter = 'price_drop')}
		>
			Price Drops
		</FilterChip>
		<FilterChip
			active={activeFilter === 'target_reached'}
			onclick={() => (activeFilter = 'target_reached')}
		>
			Target Reached
		</FilterChip>
	</div>

	<!-- Alerts List -->
	<div class="space-y-3">
		{#each filteredAlerts as alert (alert.id)}
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
									class="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase"
								>
									New
								</span>
							{/if}
						</div>
						<p class="mb-2 text-sm text-[#616889]">{alert.venue}</p>
						<p class="text-primary mb-3 text-xs font-medium tracking-wider uppercase">
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
							<a
								href={resolve(`/events/${alert.id}`)}
								data-sveltekit-preload-data
								class="text-primary hover:text-primary/80 flex items-center gap-1 text-sm font-semibold transition-colors"
							>
								View Event
								<span class="material-symbols-outlined text-[16px]">arrow_forward</span>
							</a>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<!-- Empty State -->
			<div class="flex flex-col items-center justify-center py-16 text-center">
				<div class="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-[#f6f6f8]">
					<span class="material-symbols-outlined text-5xl text-[#616889]">notifications_off</span>
				</div>
				<h3 class="mb-2 text-2xl font-black text-[#111218]">No alerts yet</h3>
				<p class="mb-6 max-w-md text-sm text-[#616889]">
					Start tracking events and you'll see price drop notifications here.
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
