<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Header from '$lib/components/Header.svelte';
	import FeatureCard from '$lib/components/shared/FeatureCard.svelte';
	import clerkStore from '$lib/components/clerk/store';

	let searchQuery = $state('');
	let clerk = $state($clerkStore);
	let isSignedIn = $derived(clerk?.user != null);

	clerkStore.subscribe((value) => {
		clerk = value;
	});

	function handleSearch() {
		if (searchQuery.trim()) {
			goto(resolve(`/add?q=${encodeURIComponent(searchQuery)}`));
		}
	}
</script>

<svelte:head>
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

<div class="relative flex min-h-screen w-full flex-col">
	<Header />

	<main class="flex-1">
		<!-- Hero Section -->
		<section class="@container">
			<div class="p-0">
				<div
					class="relative flex min-h-[520px] flex-col items-center justify-center gap-6 bg-cover bg-center bg-no-repeat p-6 text-center"
					style="background-image: linear-gradient(rgba(16, 19, 34, 0.92) 0%, rgba(19, 55, 236, 0.65) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuAziDlpaMWyixT1uGCQ_OO3DnZtpeRdyOPx7gzPiygkOKjqpQB2nAkU5odIw7ujnqmP-LSIrylQ9DQbEFwtLHQMpDhIODm9mQHYPH9F1dsAh4mn-0qODVERwN9dAH8Ib8gOzi5Q34JShpsZqSClVlYRuHj_-ByugsHwRmaByRUN7_5BUo_Sk1qlkUlc2gpMqoEiu7JqU3Sc1Lph4VVNf-RmJcihPz9WKzGWd4nBtmVKvqCpBGGSQZv4dvSdml9SdrsOS-lSRbeOPfo');"
				>
					<div class="flex max-w-[480px] flex-col gap-3">
						<h1
							class="text-4xl leading-[1.1] font-black tracking-[-0.033em] text-white drop-shadow-lg @[480px]:text-5xl"
						>
							Track Ticket Prices Instantly
						</h1>
						<p
							class="text-sm leading-relaxed font-normal text-white drop-shadow-md @[480px]:text-base"
						>
							Paste an event link from Ticketmaster or StubHub and we'll alert you when prices drop.
						</p>
					</div>
					<div class="mt-4 w-full max-w-[480px]">
						{#if isSignedIn}
							<a
								href={resolve('/dashboard')}
								data-sveltekit-preload-data
								class="text-primary block w-full rounded-xl bg-white py-4 text-center text-base font-bold shadow-2xl transition-all hover:bg-gray-50 active:scale-[0.98]"
							>
								Go to Dashboard
							</a>
						{:else}
							<div class="flex flex-col gap-3">
								<div class="group relative">
									<div
										class="group-focus-within:text-primary pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 transition-colors"
									>
										<span class="material-symbols-outlined text-[20px]">link</span>
									</div>
									<input
										bind:value={searchQuery}
										onkeydown={(e) => e.key === 'Enter' && handleSearch()}
										class="focus:ring-primary/20 block w-full rounded-xl border-none bg-white py-4 pr-24 pl-11 text-sm font-medium text-[#111218] shadow-2xl transition-all focus:ring-4"
										placeholder="Paste event URL or search..."
										type="text"
									/>
									<div class="absolute inset-y-1.5 right-1.5 flex items-center">
										<button
											type="button"
											onclick={handleSearch}
											class="bg-primary h-full rounded-lg px-6 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
										>
											Track
										</button>
									</div>
								</div>
								<div
									class="flex justify-center gap-4 text-[11px] font-bold tracking-widest text-white/70 uppercase drop-shadow"
								>
									<span>Ticketmaster</span>
									<span>•</span>
									<span>StubHub</span>
									<span>•</span>
									<span>SeatGeek</span>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</section>

		<!-- Features Section -->
		<section class="@container bg-white px-4 py-12">
			<div class="mx-auto flex max-w-4xl flex-col gap-10">
				<div class="flex flex-col gap-3 text-center @[480px]:text-left">
					<h2 class="text-3xl leading-tight font-black tracking-tight text-[#111218]">
						Smart tools for smart fans
					</h2>
					<p class="max-w-[600px] text-base font-normal text-[#616889]">
						Stop refreshing the page. We monitor every price movement so you don't have to.
					</p>
				</div>
				<div class="grid grid-cols-1 gap-4 @[640px]:grid-cols-3">
					<FeatureCard
						icon="notifications_active"
						title="Price Drop Alerts"
						description="Get notified the second tickets hit your target price."
					/>
					<FeatureCard
						icon="grid_view"
						title="Track by Section"
						description="Focus on the rows you want, skip the ones you don't."
					/>
					<FeatureCard
						icon="devices"
						title="Multi-platform"
						description="Monitor Ticketmaster, StubHub, and more simultaneously."
					/>
				</div>
			</div>
		</section>

		<!-- CTA Section -->
		<section class="bg-primary @container px-4 py-16 text-center text-white">
			<div class="mx-auto flex max-w-[600px] flex-col items-center gap-8">
				<div class="flex flex-col gap-3">
					<h2 class="text-3xl leading-tight font-black tracking-tight @[480px]:text-4xl">
						Ready to find the best deal?
					</h2>
					<p class="text-base font-normal text-white/80">
						Join 50,000+ fans saving an average of $42 per ticket.
					</p>
				</div>
				<div class="flex flex-col items-center gap-3">
					<a
						href={resolve('/dashboard')}
						data-sveltekit-preload-data
						class="text-primary flex h-14 min-w-[200px] cursor-pointer items-center justify-center rounded-xl bg-white px-8 text-base font-black shadow-xl transition-all hover:bg-gray-100"
					>
						Start Free Trial
					</a>
					<a
						href={resolve('/pricing')}
						data-sveltekit-preload-data
						class="text-sm font-semibold text-white/90 underline-offset-4 transition-all hover:text-white hover:underline"
					>
						View Pricing
					</a>
				</div>
				<p class="text-xs font-medium tracking-widest text-white/60 uppercase">
					No credit card required
				</p>
			</div>
		</section>
	</main>

	<!-- Footer -->
	<footer
		class="flex flex-col items-center gap-8 border-t border-[#dbdde6] bg-white px-6 py-12 text-center"
	>
		<div class="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
			<a
				href={resolve('/pricing')}
				data-sveltekit-preload-data
				class="hover:text-primary text-sm font-semibold text-[#616889] transition-colors"
			>
				Pricing
			</a>
			<a
				href={resolve('/donate')}
				data-sveltekit-preload-data
				class="hover:text-primary text-sm font-semibold text-[#616889] transition-colors"
			>
				💙 Donate
			</a>
			<a
				href={resolve('/privacy')}
				data-sveltekit-preload-data
				class="hover:text-primary text-sm font-semibold text-[#616889] transition-colors"
			>
				Privacy Policy
			</a>
			<a
				href={resolve('/terms')}
				data-sveltekit-preload-data
				class="hover:text-primary text-sm font-semibold text-[#616889] transition-colors"
			>
				Terms of Service
			</a>
			<a
				href={resolve('/support')}
				data-sveltekit-preload-data
				class="hover:text-primary text-sm font-semibold text-[#616889] transition-colors"
			>
				Support
			</a>
		</div>
		<div class="flex justify-center gap-6">
			<button type="button" class="hover:text-primary text-[#616889] transition-colors">
				<span class="material-symbols-outlined">share</span>
			</button>
			<button type="button" class="hover:text-primary text-[#616889] transition-colors">
				<span class="material-symbols-outlined">camera</span>
			</button>
			<button type="button" class="hover:text-primary text-[#616889] transition-colors">
				<span class="material-symbols-outlined">alternate_email</span>
			</button>
		</div>
		<div class="flex flex-col gap-2">
			<div class="text-primary flex items-center justify-center gap-2">
				<span class="material-symbols-outlined text-[20px]">confirmation_number</span>
				<span class="font-bold">PriceTracker</span>
			</div>
			<p class="text-xs text-[#616889]">© 2024 PriceTracker Inc. All rights reserved.</p>
		</div>
	</footer>

	<!-- Bottom Spacing for Mobile Home Bar -->
	<div class="h-6 bg-white"></div>
</div>
