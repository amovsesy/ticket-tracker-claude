<script lang="ts">
	import Header from '$lib/components/Header.svelte';
</script>

<svelte:head>
	<title>Support - PriceTracker</title>
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
		<h1 class="mb-4 text-4xl font-black text-[#111218]">Support Center</h1>
		<p class="mb-8 text-lg text-[#616889]">
			Get help with PriceTracker. Browse FAQs or contact our support team.
		</p>

		<!-- Contact Cards -->
		<div class="mb-12 grid gap-4 md:grid-cols-2">
			<a
				href="mailto:support@pricetracker.com"
				data-sveltekit-preload-data
				class="flex items-start gap-4 rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md"
			>
				<div class="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-lg">
					<span class="material-symbols-outlined">mail</span>
				</div>
				<div>
					<h3 class="mb-1 text-lg font-bold text-[#111218]">Email Support</h3>
					<p class="mb-2 text-sm text-[#616889]">Get help via email</p>
					<p class="text-primary text-sm font-medium">support@pricetracker.com</p>
				</div>
			</a>

			<div class="flex items-start gap-4 rounded-xl bg-white p-6 shadow-sm">
				<div class="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-lg">
					<span class="material-symbols-outlined">schedule</span>
				</div>
				<div>
					<h3 class="mb-1 text-lg font-bold text-[#111218]">Response Time</h3>
					<p class="mb-2 text-sm text-[#616889]">Typical response within</p>
					<p class="text-sm font-medium text-[#111218]">24 hours</p>
				</div>
			</div>
		</div>

		<!-- FAQs -->
		<div class="mb-8">
			<h2 class="mb-6 text-2xl font-bold text-[#111218]">Frequently Asked Questions</h2>
			<div class="space-y-4">
				<!-- FAQ Item -->
				<details class="group rounded-xl bg-white p-6 shadow-sm">
					<summary
						class="flex cursor-pointer items-center justify-between font-semibold text-[#111218]"
					>
						<span>How does PriceTracker work?</span>
						<span class="material-symbols-outlined transition-transform group-open:rotate-180">
							expand_more
						</span>
					</summary>
					<p class="mt-4 text-[#616889]">
						PriceTracker monitors ticket prices on platforms like Ticketmaster, StubHub, and
						SeatGeek. When you add an event and set a target price, we check prices regularly and
						notify you instantly when they drop below your threshold.
					</p>
				</details>

				<details class="group rounded-xl bg-white p-6 shadow-sm">
					<summary
						class="flex cursor-pointer items-center justify-between font-semibold text-[#111218]"
					>
						<span>What's included in the free plan?</span>
						<span class="material-symbols-outlined transition-transform group-open:rotate-180">
							expand_more
						</span>
					</summary>
					<p class="mt-4 text-[#616889]">
						Free users can track up to 3 events with email notifications. Prices are checked every
						15 minutes, and you receive alerts when prices drop below your target.
					</p>
				</details>

				<details class="group rounded-xl bg-white p-6 shadow-sm">
					<summary
						class="flex cursor-pointer items-center justify-between font-semibold text-[#111218]"
					>
						<span>How often are prices updated?</span>
						<span class="material-symbols-outlined transition-transform group-open:rotate-180">
							expand_more
						</span>
					</summary>
					<p class="mt-4 text-[#616889]">
						Free users get price updates every 15 minutes. Premium users receive real-time updates
						every minute, ensuring you never miss a price drop.
					</p>
				</details>

				<details class="group rounded-xl bg-white p-6 shadow-sm">
					<summary
						class="flex cursor-pointer items-center justify-between font-semibold text-[#111218]"
					>
						<span>Can I track events from any ticket platform?</span>
						<span class="material-symbols-outlined transition-transform group-open:rotate-180">
							expand_more
						</span>
					</summary>
					<p class="mt-4 text-[#616889]">
						Currently, we support Ticketmaster, StubHub, and SeatGeek. We're working on adding more
						platforms based on user demand.
					</p>
				</details>

				<details class="group rounded-xl bg-white p-6 shadow-sm">
					<summary
						class="flex cursor-pointer items-center justify-between font-semibold text-[#111218]"
					>
						<span>How do I cancel my subscription?</span>
						<span class="material-symbols-outlined transition-transform group-open:rotate-180">
							expand_more
						</span>
					</summary>
					<p class="mt-4 text-[#616889]">
						You can cancel anytime from your account settings. Your subscription will remain active
						until the end of your current billing period, and you won't be charged again.
					</p>
				</details>

				<details class="group rounded-xl bg-white p-6 shadow-sm">
					<summary
						class="flex cursor-pointer items-center justify-between font-semibold text-[#111218]"
					>
						<span>Are SMS alerts available?</span>
						<span class="material-symbols-outlined transition-transform group-open:rotate-180">
							expand_more
						</span>
					</summary>
					<p class="mt-4 text-[#616889]">
						SMS alerts are currently free during our launch period! They're available for US and
						Canada phone numbers. Message and data rates may apply.
					</p>
				</details>

				<details class="group rounded-xl bg-white p-6 shadow-sm">
					<summary
						class="flex cursor-pointer items-center justify-between font-semibold text-[#111218]"
					>
						<span>Why aren't I receiving notifications?</span>
						<span class="material-symbols-outlined transition-transform group-open:rotate-180">
							expand_more
						</span>
					</summary>
					<p class="mt-4 text-[#616889]">
						Check your notification settings to ensure alerts are enabled. Also verify your email
						address and check your spam folder. If you've enabled SMS alerts, make sure your phone
						number is verified.
					</p>
				</details>
			</div>
		</div>

		<!-- Still Need Help -->
		<div class="from-primary/10 rounded-xl bg-gradient-to-br to-blue-50 p-8 text-center">
			<h3 class="mb-2 text-2xl font-bold text-[#111218]">Still need help?</h3>
			<p class="mb-6 text-[#616889]">
				Can't find what you're looking for? Our support team is here to help.
			</p>
			<a
				href="mailto:support@pricetracker.com"
				data-sveltekit-preload-data
				class="bg-primary hover:bg-primary/90 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-bold text-white transition-all"
			>
				<span class="material-symbols-outlined">mail</span>
				Contact Support
			</a>
		</div>
	</div>
</div>
