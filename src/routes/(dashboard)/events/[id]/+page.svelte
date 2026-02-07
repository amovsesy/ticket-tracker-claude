<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import { Switch } from '$lib/components/ui/switch';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import type { PageData } from './$types';
	import { Line } from 'svelte-chartjs';
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

	// Register Chart.js components
	ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);

	let { data }: { data: PageData } = $props();

	let activeSection = $state('all');
	let timeRange = $state('1M'); // 1W, 1M, 3M, All
	let isPaused = $state(data.event.isPaused);

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

		const cutoffDate = new Date(now);
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
					borderColor: 'rgb(59, 130, 246)',
					backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
					callback: (value) => `$${value}`
				}
			},
			x: {
				ticks: {
					maxTicksLimit: 8
				}
			}
		}
	};

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
		if (change < 0) return 'text-green-600 dark:text-green-400';
		if (change > 0) return 'text-red-600 dark:text-red-400';
		return 'text-muted-foreground';
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

<div class="min-h-screen bg-background pb-20 md:pb-8">
	<!-- Header -->
	<div class="border-b bg-card">
		<div class="container mx-auto px-4 py-4">
			<div class="flex items-center justify-between">
				<Button href="/dashboard" variant="ghost" size="icon">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</Button>
				<Button variant="ghost" size="icon" onclick={handleShare}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
						/>
					</svg>
				</Button>
			</div>
		</div>
	</div>

	<div class="container mx-auto px-4 py-6">
		<!-- Event Header -->
		<div class="mb-6">
			<div class="mb-4 overflow-hidden rounded-lg">
				<img
					src={data.event.imageUrl}
					alt={data.event.name}
					class="h-48 w-full object-cover md:h-64"
				/>
			</div>

			<div class="flex items-start justify-between gap-4">
				<div class="flex-1">
					<h1 class="mb-2 text-2xl font-bold md:text-3xl">{data.event.name}</h1>
					<div class="space-y-1 text-sm text-muted-foreground">
						<div class="flex items-center gap-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
							{data.event.venue} · {data.event.location}
						</div>
						<div class="flex items-center gap-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							{formatDate(data.event.date)}
						</div>
					</div>
				</div>
				<Badge variant="secondary" class="capitalize">{data.event.category}</Badge>
			</div>
		</div>

		<!-- Section Filters -->
		<Tabs bind:value={activeSection} class="mb-6">
			<TabsList class="w-full">
				<TabsTrigger value="all" class="flex-1">All Sections</TabsTrigger>
				<TabsTrigger value="floor" class="flex-1">Floor</TabsTrigger>
				<TabsTrigger value="lowerBowl" class="flex-1">Lower Bowl</TabsTrigger>
				<TabsTrigger value="upperBowl" class="flex-1">Upper Bowl</TabsTrigger>
			</TabsList>
		</Tabs>

		<!-- Current Price Card -->
		<Card class="mb-6">
			<CardContent class="p-6">
				<div class="flex items-center justify-between">
					<div>
						<div class="mb-1 text-sm text-muted-foreground">Current Lowest Price</div>
						<div class="text-3xl font-bold">
							{formatPrice(
								data.event.currentPrices[activeSection as keyof typeof data.event.currentPrices]
							)}
						</div>
					</div>
					<div class="text-right">
						<Badge
							variant={data.event.percentageChange < 0 ? 'default' : 'destructive'}
							class="mb-2"
						>
							{data.event.percentageChange > 0 ? '↑' : '↓'}
							{Math.abs(data.event.percentageChange).toFixed(1)}%
						</Badge>
						<div class={`text-sm font-semibold ${getChangeColor(data.event.priceChange)}`}>
							{data.event.priceChange < 0 ? '-' : '+'}{formatPrice(
								Math.abs(data.event.priceChange)
							)}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>

		<!-- Price Chart -->
		<Card class="mb-6">
			<CardHeader>
				<div class="flex items-center justify-between">
					<CardTitle>Price History</CardTitle>
					<div class="flex gap-2">
						<Button
							variant={timeRange === '1W' ? 'default' : 'outline'}
							size="sm"
							onclick={() => (timeRange = '1W')}
						>
							1W
						</Button>
						<Button
							variant={timeRange === '1M' ? 'default' : 'outline'}
							size="sm"
							onclick={() => (timeRange = '1M')}
						>
							1M
						</Button>
						<Button
							variant={timeRange === '3M' ? 'default' : 'outline'}
							size="sm"
							onclick={() => (timeRange = '3M')}
						>
							3M
						</Button>
						<Button
							variant={timeRange === 'All' ? 'default' : 'outline'}
							size="sm"
							onclick={() => (timeRange = 'All')}
						>
							All
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div class="h-64 w-full">
					<Line data={chartData()} options={chartOptions} />
				</div>
			</CardContent>
		</Card>

		<div class="grid gap-6 md:grid-cols-2">
			<!-- Tracking Status Card -->
			<Card>
				<CardHeader>
					<CardTitle>Tracking Status</CardTitle>
				</CardHeader>
				<CardContent class="space-y-4">
					<div class="flex items-center justify-between">
						<span class="text-sm text-muted-foreground">Status</span>
						<Badge variant={isPaused ? 'secondary' : 'default'}>
							{isPaused ? 'Paused' : 'Active'}
						</Badge>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-sm text-muted-foreground">Target Price</span>
						<span class="font-semibold">{formatPrice(data.event.targetPrice)}</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-sm text-muted-foreground">Section</span>
						<span class="font-semibold">{data.event.section}</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-sm text-muted-foreground">Last Checked</span>
						<span class="text-sm">{formatDate(data.event.lastChecked)}</span>
					</div>

					<div class="pt-4">
						<Button href="/events/{data.event.id}/edit" class="w-full" variant="outline">
							Edit Alert Settings
						</Button>
					</div>
				</CardContent>
			</Card>

			<!-- Recent Price Changes -->
			<Card>
				<CardHeader>
					<CardTitle>Recent Price Changes</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="space-y-3">
						{#each data.recentChanges as change}
							<div class="flex items-center justify-between border-b pb-3 last:border-0">
								<div class="flex-1">
									<div class="mb-1 text-sm font-medium">
										{formatPrice(change.oldPrice)} → {formatPrice(change.newPrice)}
									</div>
									<div class="text-xs text-muted-foreground">
										{formatDate(change.date)} · {change.section}
									</div>
								</div>
								<div class={`text-sm font-semibold ${getChangeColor(change.change)}`}>
									{change.change < 0 ? '' : '+'}{change.percentageChange.toFixed(1)}%
								</div>
							</div>
						{/each}
					</div>
				</CardContent>
			</Card>
		</div>

		<!-- Pause Notifications -->
		<Card class="mt-6">
			<CardContent class="flex items-center justify-between p-6">
				<div>
					<h3 class="font-semibold">Pause Notifications</h3>
					<p class="text-sm text-muted-foreground">
						Temporarily stop receiving alerts for this event
					</p>
				</div>
				<Switch checked={isPaused} onCheckedChange={handleTogglePause} />
			</CardContent>
		</Card>
	</div>
</div>

<BottomNav />
