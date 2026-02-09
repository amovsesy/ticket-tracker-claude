<script lang="ts">
	import { onMount } from 'svelte';

	import FilterChip from '$lib/components/shared/FilterChip.svelte';
	import type { PageData } from './$types';
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale,
		type ChartData,
		type ChartOptions
	} from 'chart.js';
	import { SvelteDate } from 'svelte/reactivity';

	// Register Chart.js components
	ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);

	let { data }: { data: PageData } = $props();

	let chartCanvas: HTMLCanvasElement | undefined = $state();
	let chartInstance: ChartJS<'line'> | undefined = $state();

	let activeSection = $state('all');
	let timeRange = $state('1M'); // 1W, 1M, 3M, All
	let isPaused = $derived(false);

	// Initialize isPaused from data
	$effect(() => {
		isPaused = data.event.isPaused;
	});

	// Filter price history based on time range
	const filteredPriceHistory = $derived(() => {
		const now = new Date();
		let daysBack = 30;

		switch (timeRange) {
			case '1W':
				daysBack = 7;
				break;
			case '1M':
				daysBack = 30;
				break;
			case '3M':
				daysBack = 90;
				break;
			case 'All':
				daysBack = 365;
				break;
		}

		const cutoffDate = new SvelteDate(now);
		cutoffDate.setDate(cutoffDate.getDate() - daysBack);

		return data.priceHistory.filter((p) => new Date(p.date) >= cutoffDate);
	});

	// Chart data
	const chartData = $derived(() => {
		const history = filteredPriceHistory();
		return {
			labels: history.map((p) =>
				new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(
					new Date(p.date)
				)
			),
			datasets: [
				{
					label: 'Price',
					data: history.map((p) => p.price),
					borderColor: '#1337ec',
					backgroundColor: 'rgba(19, 55, 236, 0.1)',
					tension: 0.4,
					fill: true
				}
			]
		} satisfies ChartData<'line'>;
	});

	// Chart options
	const chartOptions: ChartOptions<'line'> = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false
			},
			tooltip: {
				callbacks: {
					label: (context) => {
						return `$${context.parsed.y.toFixed(2)}`;
					}
				}
			}
		},
		scales: {
			y: {
				beginAtZero: false,
				ticks: {
					callback: (value) => `$${value}`,
					color: '#616889'
				},
				grid: {
					color: '#dbdde6'
				}
			},
			x: {
				ticks: {
					maxTicksLimit: 8,
					color: '#616889'
				},
				grid: {
					color: '#dbdde6'
				}
			}
		}
	};

	// Initialize and update chart
	onMount(() => {
		if (chartCanvas) {
			chartInstance = new ChartJS(chartCanvas, {
				type: 'line',
				data: chartData(),
				options: chartOptions
			});
		}

		return () => {
			chartInstance?.destroy();
		};
	});

	// Update chart when data changes
	$effect(() => {
		if (chartInstance) {
			chartInstance.data = chartData();
			chartInstance.update();
		}
	});

	function formatDate(dateString: string) {
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		}).format(new Date(dateString));
	}

	function formatPrice(price: number) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(price);
	}

	function getChangeColor(change: number) {
		if (change < 0) return 'text-green-600';
		if (change > 0) return 'text-red-600';
		return 'text-[#616889]';
	}

	function handleShare() {
		if (navigator.share) {
			navigator.share({
				title: data.event.name,
				text: `Check out ${data.event.name} at ${data.event.venue}`,
				url: window.location.href
			});
		} else {
			navigator.clipboard.writeText(window.location.href);
			alert('Link copied to clipboard!');
		}
	}

	function handleTogglePause() {
		isPaused = !isPaused;
		// In a real app, this would call an API to update the database
		alert(isPaused ? 'Notifications paused' : 'Notifications resumed');
	}
</script>

<svelte:head>
	<title>{data.event.name} - PriceTracker</title>
</svelte:head>

<div class="min-h-screen bg-[#f6f6f8] pb-20 md:pb-8">
	<!-- Header -->
	<div class="border-b border-[#dbdde6] bg-white">
		<div class="mx-auto max-w-7xl px-4 py-4">
			<div class="flex items-center justify-between">
				<button
					type="button"
					href="/dashboard"
					data-sveltekit-preload-data
					class="flex items-center justify-center rounded-xl p-2 text-[#111218] transition-colors hover:bg-[#f6f6f8]"
				>
					<span class="material-symbols-outlined">arrow_back</span>
				</button>
				<button
					type="button"
					onclick={handleShare}
					class="flex items-center justify-center rounded-xl p-2 text-[#111218] transition-colors hover:bg-[#f6f6f8]"
				>
					<span class="material-symbols-outlined">share</span>
				</button>
			</div>
		</div>
	</div>

	<div class="mx-auto max-w-7xl px-4 py-6">
		<!-- Event Header -->
		<div class="mb-6">
			<div class="mb-4 overflow-hidden rounded-2xl shadow-sm">
				<img
					src={data.event.imageUrl}
					alt={data.event.name}
					class="h-48 w-full object-cover md:h-64"
				/>
			</div>

			<div class="flex items-start justify-between gap-4">
				<div class="flex-1">
					<h1 class="mb-2 text-2xl leading-tight font-black text-[#111218] md:text-3xl">
						{data.event.name}
					</h1>
					<div class="space-y-1 text-sm text-[#616889]">
						<div class="flex items-center gap-2">
							<span class="material-symbols-outlined text-[16px]">location_on</span>
							{data.event.venue} · {data.event.location}
						</div>
						<div class="flex items-center gap-2">
							<span class="material-symbols-outlined text-[16px]">calendar_today</span>
							{formatDate(data.event.date)}
						</div>
					</div>
				</div>
				<span
					class="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase"
				>
					{data.event.category}
				</span>
			</div>
		</div>

		<!-- Section Filters -->
		<div class="mb-6 flex gap-2 overflow-x-auto">
			<FilterChip active={activeSection === 'all'} onclick={() => (activeSection = 'all')}>
				All Sections
			</FilterChip>
			<FilterChip active={activeSection === 'floor'} onclick={() => (activeSection = 'floor')}>
				Floor
			</FilterChip>
			<FilterChip
				active={activeSection === 'lowerBowl'}
				onclick={() => (activeSection = 'lowerBowl')}
			>
				Lower Bowl
			</FilterChip>
			<FilterChip
				active={activeSection === 'upperBowl'}
				onclick={() => (activeSection = 'upperBowl')}
			>
				Upper Bowl
			</FilterChip>
		</div>

		<!-- Current Price Card -->
		<div class="mb-6 rounded-2xl border border-[#dbdde6] bg-white p-6 shadow-sm">
			<div class="flex items-center justify-between">
				<div>
					<div class="mb-1 text-sm font-medium text-[#616889]">Current Lowest Price</div>
					<div class="text-3xl font-black text-[#111218]">
						{formatPrice(
							data.event.currentPrices[activeSection as keyof typeof data.event.currentPrices]
						)}
					</div>
				</div>
				<div class="text-right">
					<span
						class="mb-2 inline-block rounded-full px-2.5 py-1 text-xs font-bold {data.event
							.percentageChange < 0
							? 'bg-green-100 text-green-600'
							: 'bg-red-100 text-red-600'}"
					>
						{data.event.percentageChange > 0 ? '↑' : '↓'}
						{Math.abs(data.event.percentageChange).toFixed(1)}%
					</span>
					<div class={`text-sm font-bold ${getChangeColor(data.event.priceChange)}`}>
						{data.event.priceChange < 0 ? '-' : '+'}{formatPrice(Math.abs(data.event.priceChange))}
					</div>
				</div>
			</div>
		</div>

		<!-- Price Chart -->
		<div class="mb-6 rounded-2xl border border-[#dbdde6] bg-white shadow-sm">
			<div class="border-b border-[#dbdde6] p-6">
				<div class="flex flex-wrap items-center justify-between gap-4">
					<h2 class="text-xl font-bold text-[#111218]">Price History</h2>
					<div class="flex gap-2">
						<button
							type="button"
							onclick={() => (timeRange = '1W')}
							class="rounded-xl px-4 py-2 text-sm font-bold transition-all {timeRange === '1W'
								? 'bg-primary text-white shadow-sm'
								: 'hover:border-primary/30 border border-[#dbdde6] bg-white text-[#111218]'}"
						>
							1W
						</button>
						<button
							type="button"
							onclick={() => (timeRange = '1M')}
							class="rounded-xl px-4 py-2 text-sm font-bold transition-all {timeRange === '1M'
								? 'bg-primary text-white shadow-sm'
								: 'hover:border-primary/30 border border-[#dbdde6] bg-white text-[#111218]'}"
						>
							1M
						</button>
						<button
							type="button"
							onclick={() => (timeRange = '3M')}
							class="rounded-xl px-4 py-2 text-sm font-bold transition-all {timeRange === '3M'
								? 'bg-primary text-white shadow-sm'
								: 'hover:border-primary/30 border border-[#dbdde6] bg-white text-[#111218]'}"
						>
							3M
						</button>
						<button
							type="button"
							onclick={() => (timeRange = 'All')}
							class="rounded-xl px-4 py-2 text-sm font-bold transition-all {timeRange === 'All'
								? 'bg-primary text-white shadow-sm'
								: 'hover:border-primary/30 border border-[#dbdde6] bg-white text-[#111218]'}"
						>
							All
						</button>
					</div>
				</div>
			</div>
			<div class="p-6">
				<div class="h-64 w-full">
					<canvas bind:this={chartCanvas}></canvas>
				</div>
			</div>
		</div>

		<div class="grid gap-6 md:grid-cols-2">
			<!-- Tracking Status Card -->
			<div class="rounded-2xl border border-[#dbdde6] bg-white shadow-sm">
				<div class="border-b border-[#dbdde6] p-6">
					<h2 class="text-xl font-bold text-[#111218]">Tracking Status</h2>
				</div>
				<div class="space-y-4 p-6">
					<div class="flex items-center justify-between">
						<span class="text-sm font-medium text-[#616889]">Status</span>
						<span
							class="rounded-full px-2.5 py-1 text-xs font-bold {isPaused
								? 'bg-gray-100 text-gray-600'
								: 'bg-green-100 text-green-600'}"
						>
							{isPaused ? 'Paused' : 'Active'}
						</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-sm font-medium text-[#616889]">Target Price</span>
						<span class="font-bold text-[#111218]">{formatPrice(data.event.targetPrice)}</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-sm font-medium text-[#616889]">Section</span>
						<span class="font-bold text-[#111218]">{data.event.section}</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-sm font-medium text-[#616889]">Last Checked</span>
						<span class="text-sm text-[#111218]">{formatDate(data.event.lastChecked)}</span>
					</div>

					<div class="pt-4">
						<button
							type="button"
							href={`/events/${data.event.id}/edit`}
							data-sveltekit-preload-data
							class="hover:border-primary/30 w-full rounded-xl border border-[#dbdde6] bg-white px-4 py-2.5 text-sm font-bold text-[#111218] shadow-sm transition-all hover:shadow-md"
						>
							Edit Alert Settings
						</button>
					</div>
				</div>
			</div>

			<!-- Recent Price Changes -->
			<div class="rounded-2xl border border-[#dbdde6] bg-white shadow-sm">
				<div class="border-b border-[#dbdde6] p-6">
					<h2 class="text-xl font-bold text-[#111218]">Recent Price Changes</h2>
				</div>
				<div class="p-6">
					<div class="space-y-3">
						{#each data.recentChanges as change (change.date)}
							<div
								class="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
							>
								<div class="flex-1">
									<div class="mb-1 text-sm font-bold text-[#111218]">
										{formatPrice(change.oldPrice)} → {formatPrice(change.newPrice)}
									</div>
									<div class="text-xs text-[#616889]">
										{formatDate(change.date)} · {change.section}
									</div>
								</div>
								<div class={`text-sm font-bold ${getChangeColor(change.change)}`}>
									{change.change < 0 ? '' : '+'}{change.percentageChange.toFixed(1)}%
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<!-- Pause Notifications -->
		<div class="mt-6 rounded-2xl border border-[#dbdde6] bg-white shadow-sm">
			<div class="flex items-center justify-between p-6">
				<div>
					<h3 class="font-bold text-[#111218]">Pause Notifications</h3>
					<p class="text-sm text-[#616889]">Temporarily stop receiving alerts for this event</p>
				</div>
				<button
					type="button"
					onclick={handleTogglePause}
					aria-label={isPaused ? 'Resume notifications' : 'Pause notifications'}
					class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors {isPaused
						? 'bg-gray-200'
						: 'bg-primary'}"
				>
					<span
						class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform {isPaused
							? 'translate-x-1'
							: 'translate-x-6'}"
					></span>
				</button>
			</div>
		</div>
	</div>
</div>
