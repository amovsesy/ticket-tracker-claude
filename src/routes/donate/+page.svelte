<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import Header from '$lib/components/Header.svelte';

	const donationAmounts = [5, 10, 20, 50, 100];
	let customAmount = $state('');
	let selectedAmount = $state(10);
</script>

<svelte:head>
	<title>Support PriceTracker - Donate</title>
	<link
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
		rel="stylesheet"
	/>
	<style>
		.material-symbols-outlined {
			font-variation-settings:
				'FILL' 0,
				'wght' 400,
				'GRAD' 0,
				'opsz' 24;
		}
	</style>
</svelte:head>

<div class="min-h-screen bg-[#f6f6f8]">
	<Header />
	<div class="container mx-auto max-w-4xl px-4 py-12">
		<!-- Header -->
		<div class="mb-8 text-center">
			<h1 class="mb-4 text-4xl font-black text-[#111218]">Support PriceTracker</h1>
			<p class="text-lg text-[#616889]">
				Help us keep the service free and running for everyone 💙
			</p>
		</div>

		<!-- Main Donation Card -->
		<Card class="mb-8">
			<CardHeader>
				<CardTitle class="text-center text-2xl">Make a Contribution</CardTitle>
			</CardHeader>
			<CardContent class="space-y-6">
				<!-- Pre-set Amounts -->
				<div>
					<label class="mb-3 block text-sm font-medium text-[#111218]">
						Choose an amount or enter your own:
					</label>
					<div class="grid grid-cols-3 gap-3 md:grid-cols-5">
						{#each donationAmounts as amount (amount)}
							<button
								type="button"
								onclick={() => {
									selectedAmount = amount;
									customAmount = '';
								}}
								class="rounded-lg border-2 px-4 py-3 text-lg font-bold transition-all {selectedAmount ===
									amount && !customAmount
									? 'border-primary bg-primary text-white'
									: 'hover:border-primary/50 border-[#dbdde6] text-[#111218]'}"
							>
								${amount}
							</button>
						{/each}
					</div>
				</div>

				<!-- Custom Amount -->
				<div>
					<label for="customAmount" class="mb-2 block text-sm font-medium text-[#111218]">
						Or enter a custom amount:
					</label>
					<div class="relative">
						<span class="absolute top-1/2 left-4 -translate-y-1/2 text-lg text-[#616889]"> $ </span>
						<input
							id="customAmount"
							type="number"
							bind:value={customAmount}
							min="1"
							step="1"
							placeholder="25"
							class="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-[#dbdde6] py-3 pr-4 pl-8 text-lg focus:ring-2 focus:outline-none"
						/>
					</div>
				</div>

				<!-- Donate Button -->
				<Button class="w-full py-6 text-lg font-bold" size="lg">
					Donate ${customAmount || selectedAmount}
				</Button>

				<p class="text-center text-xs text-[#616889]">
					Payment processing coming soon! For now, this is just a preview.
				</p>
			</CardContent>
		</Card>

		<!-- Why Donate Section -->
		<div class="mb-8 grid gap-4 md:grid-cols-2">
			<Card>
				<CardHeader>
					<CardTitle class="flex items-center gap-2">
						<span class="material-symbols-outlined text-primary">rocket_launch</span>
						Keep It Free
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p class="text-sm text-[#616889]">
						Your donations help us keep PriceTracker free for everyone. No paywalls, no premium
						tiers - just fair access for all ticket buyers.
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle class="flex items-center gap-2">
						<span class="material-symbols-outlined text-primary">speed</span>
						Better Service
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p class="text-sm text-[#616889]">
						Donations fund server costs, faster price checks, and new features. The more support we
						get, the better the service becomes.
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle class="flex items-center gap-2">
						<span class="material-symbols-outlined text-primary">code</span>
						Support the Developer
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p class="text-sm text-[#616889]">
						This project is built and maintained by an independent developer. Your support helps
						dedicate more time to improvements.
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle class="flex items-center gap-2">
						<span class="material-symbols-outlined text-primary">volunteer_activism</span>
						Pay What You Want
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p class="text-sm text-[#616889]">
						Every contribution helps, no matter the size. Even $1 makes a difference and shows your
						appreciation.
					</p>
				</CardContent>
			</Card>
		</div>

		<!-- Thank You Message -->
		<div class="from-primary/10 rounded-xl bg-gradient-to-br to-blue-50 p-8 text-center">
			<h3 class="mb-2 text-2xl font-bold text-[#111218]">Thank You! 💙</h3>
			<p class="text-[#616889]">
				Your support means everything. Together, we're making ticket buying fairer for everyone.
			</p>
		</div>
	</div>
</div>
