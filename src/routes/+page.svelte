<script lang="ts">
	import { goto } from '$app/navigation';
	import Header from '$lib/components/Header.svelte';
	import clerkStore from '$lib/components/clerk/store';

	let searchQuery = $state('');
	let clerk = $state($clerkStore);
	let isSignedIn = $derived(clerk?.user != null);

	clerkStore.subscribe((value) => {
		clerk = value;
	});

	function handleSearch() {
		if (searchQuery.trim()) {
			goto(`/add?q=${encodeURIComponent(searchQuery)}`);
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
							class="text-4xl font-black leading-[1.1] tracking-[-0.033em] text-white @[480px]:text-5xl drop-shadow-lg"
						>
							Track Ticket Prices Instantly
						</h1>
						<p class="text-sm font-normal leading-relaxed text-white @[480px]:text-base drop-shadow-md">
							Paste an event link from Ticketmaster or StubHub and we'll alert you when prices drop.
						</p>
					</div>
					<div class="mt-4 w-full max-w-[480px]">
						{#if isSignedIn}
							<button
								type="button"
								onclick={() => goto('/dashboard')}
								class="w-full rounded-xl bg-white py-4 text-base font-bold text-primary shadow-2xl transition-all hover:bg-gray-50 active:scale-[0.98]"
							>
								Go to Dashboard
							</button>
						{:else}
							<div class="flex flex-col gap-3">
								<div class="group relative">
									<div
										class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 transition-colors group-focus-within:text-primary"
									>
										<span class="material-symbols-outlined text-[20px]">link</span>
									</div>
									<input
										bind:value={searchQuery}
										onkeydown={(e) => e.key === 'Enter' && handleSearch()}
										class="block w-full rounded-xl border-none bg-white py-4 pl-11 pr-24 text-sm font-medium text-[#111218] shadow-2xl transition-all focus:ring-4 focus:ring-primary/20"
										placeholder="Paste event URL or search..."
										type="text"
									/>
									<div class="absolute inset-y-1.5 right-1.5 flex items-center">
										<button
											type="button"
											onclick={handleSearch}
											class="h-full rounded-lg bg-primary px-6 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
										>
											Track
										</button>
									</div>
								</div>
								<div
									class="flex justify-center gap-4 text-[11px] font-bold uppercase tracking-widest text-white/70 drop-shadow"
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
		<section class="bg-white py-12 px-4 @container">
			<div class="mx-auto flex max-w-4xl flex-col gap-10">
				<div class="flex flex-col gap-3 text-center @[480px]:text-left">
					<h2 class="text-3xl font-black leading-tight tracking-tight text-[#111218]">
						Smart tools for smart fans
					</h2>
					<p class="max-w-[600px] text-base font-normal text-[#616889]">
						Stop refreshing the page. We monitor every price movement so you don't have to.
					</p>
				</div>
				<div class="grid grid-cols-1 gap-4 @[640px]:grid-cols-3">
					<!-- Feature 1 -->
					<div
						class="flex flex-col gap-4 rounded-2xl border border-[#dbdde6] bg-[#f6f6f8]/50 p-6 transition-all hover:border-primary/30"
					>
						<div
							class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"
						>
							<span class="material-symbols-outlined">notifications_active</span>
						</div>
						<div class="flex flex-col gap-2">
							<h3 class="text-lg font-bold text-[#111218]">Price Drop Alerts</h3>
							<p class="text-sm leading-relaxed text-[#616889]">
								Get notified the second tickets hit your target price.
							</p>
						</div>
					</div>
					<!-- Feature 2 -->
					<div
						class="flex flex-col gap-4 rounded-2xl border border-[#dbdde6] bg-[#f6f6f8]/50 p-6 transition-all hover:border-primary/30"
					>
						<div
							class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"
						>
							<span class="material-symbols-outlined">grid_view</span>
						</div>
						<div class="flex flex-col gap-2">
							<h3 class="text-lg font-bold text-[#111218]">Track by Section</h3>
							<p class="text-sm leading-relaxed text-[#616889]">
								Focus on the rows you want, skip the ones you don't.
							</p>
						</div>
					</div>
					<!-- Feature 3 -->
					<div
						class="flex flex-col gap-4 rounded-2xl border border-[#dbdde6] bg-[#f6f6f8]/50 p-6 transition-all hover:border-primary/30"
					>
						<div
							class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"
						>
							<span class="material-symbols-outlined">devices</span>
						</div>
						<div class="flex flex-col gap-2">
							<h3 class="text-lg font-bold text-[#111218]">Multi-platform</h3>
							<p class="text-sm leading-relaxed text-[#616889]">
								Monitor Ticketmaster, StubHub, and more simultaneously.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- CTA Section -->
		<section class="bg-primary px-4 py-16 text-center text-white @container">
			<div class="mx-auto flex max-w-[600px] flex-col items-center gap-8">
				<div class="flex flex-col gap-3">
					<h2 class="text-3xl font-black leading-tight tracking-tight @[480px]:text-4xl">
						Ready to find the best deal?
					</h2>
					<p class="text-base font-normal text-white/80">
						Join 50,000+ fans saving an average of $42 per ticket.
					</p>
				</div>
				<button
					type="button"
					onclick={() => goto('/dashboard')}
					class="flex h-14 min-w-[200px] cursor-pointer items-center justify-center rounded-xl bg-white px-8 text-base font-black text-primary shadow-xl transition-all hover:bg-gray-100"
				>
					Start Free Trial
				</button>
				<p class="text-xs font-medium uppercase tracking-widest text-white/60">
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
				href="/privacy"
				class="text-sm font-semibold text-[#616889] transition-colors hover:text-primary"
			>
				Privacy Policy
			</a>
			<a
				href="/terms"
				class="text-sm font-semibold text-[#616889] transition-colors hover:text-primary"
			>
				Terms of Service
			</a>
			<a
				href="/support"
				class="text-sm font-semibold text-[#616889] transition-colors hover:text-primary"
			>
				Support
			</a>
		</div>
		<div class="flex justify-center gap-6">
			<button type="button" class="text-[#616889] transition-colors hover:text-primary">
				<span class="material-symbols-outlined">share</span>
			</button>
			<button type="button" class="text-[#616889] transition-colors hover:text-primary">
				<span class="material-symbols-outlined">camera</span>
			</button>
			<button type="button" class="text-[#616889] transition-colors hover:text-primary">
				<span class="material-symbols-outlined">alternate_email</span>
			</button>
		</div>
		<div class="flex flex-col gap-2">
			<div class="flex items-center justify-center gap-2 text-primary">
				<span class="material-symbols-outlined text-[20px]">confirmation_number</span>
				<span class="font-bold">PriceTracker</span>
			</div>
			<p class="text-xs text-[#616889]">© 2024 PriceTracker Inc. All rights reserved.</p>
		</div>
	</footer>

	<!-- Bottom Spacing for Mobile Home Bar -->
	<div class="h-6 bg-white"></div>
</div>
