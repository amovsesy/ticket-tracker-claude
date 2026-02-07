<script lang="ts">
	import Header from '$lib/components/Header.svelte';

	const lastUpdated = 'February 6, 2026';
</script>

<svelte:head>
	<title>Terms of Service - PriceTracker</title>
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
		<h1 class="mb-4 text-4xl font-black text-[#111218]">Terms of Service</h1>
		<p class="mb-8 text-sm font-medium text-[#616889]">Last Updated: {lastUpdated}</p>

		<div class="space-y-6 rounded-xl bg-white p-8 shadow-sm">
			<section>
				<h2 class="mb-3 text-2xl font-bold text-[#111218]">Agreement to Terms</h2>
				<p class="mb-2 text-[#111218]">
					By accessing or using PriceTracker ("Service"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.
				</p>
			</section>

			<section>
				<h2 class="mb-3 text-2xl font-bold text-[#111218]">Description of Service</h2>
				<p class="mb-2 text-[#111218]">
					PriceTracker provides price monitoring and notification services for event tickets from various platforms including Ticketmaster, StubHub, and SeatGeek. We track price changes and alert users when prices drop below their specified thresholds.
				</p>
			</section>

			<section>
				<h2 class="mb-3 text-2xl font-bold text-[#111218]">User Accounts</h2>
				<ul class="ml-6 list-disc space-y-2 text-[#111218]">
					<li>You must provide accurate, current, and complete information during registration</li>
					<li>You are responsible for maintaining the security of your account</li>
					<li>You must notify us immediately of any unauthorized access to your account</li>
					<li>You are responsible for all activities that occur under your account</li>
				</ul>
			</section>

			<section>
				<h2 class="mb-3 text-2xl font-bold text-[#111218]">Acceptable Use</h2>
				<p class="mb-2 text-[#111218]">You agree not to:</p>
				<ul class="ml-6 list-disc space-y-2 text-[#111218]">
					<li>Use the Service for any illegal purpose or in violation of any laws</li>
					<li>Attempt to interfere with, compromise, or disrupt the Service</li>
					<li>Use automated systems to access the Service without authorization</li>
					<li>Reproduce, duplicate, or copy any part of the Service without permission</li>
					<li>Resell or commercially exploit the Service without authorization</li>
				</ul>
			</section>

			<section>
				<h2 class="mb-3 text-2xl font-bold text-[#111218]">Subscription and Fees</h2>
				<ul class="ml-6 list-disc space-y-2 text-[#111218]">
					<li>Free tier users may track up to 3 events with basic email notifications</li>
					<li>Premium features require a paid subscription</li>
					<li>Subscription fees are billed in advance on a monthly basis</li>
					<li>Cancellations take effect at the end of the current billing period</li>
					<li>We reserve the right to modify subscription fees with advance notice</li>
				</ul>
			</section>

			<section>
				<h2 class="mb-3 text-2xl font-bold text-[#111218]">Data Accuracy</h2>
				<p class="text-[#111218]">
					While we strive to provide accurate price information, we cannot guarantee the accuracy, completeness, or timeliness of price data. Prices shown on third-party ticket platforms may differ from our tracked prices. Always verify pricing directly with the ticket vendor before making a purchase.
				</p>
			</section>

			<section>
				<h2 class="mb-3 text-2xl font-bold text-[#111218]">Limitation of Liability</h2>
				<p class="text-[#111218]">
					PriceTracker shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service. We do not guarantee that the Service will be uninterrupted, timely, or error-free.
				</p>
			</section>

			<section>
				<h2 class="mb-3 text-2xl font-bold text-[#111218]">Termination</h2>
				<p class="text-[#111218]">
					We reserve the right to terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.
				</p>
			</section>

			<section>
				<h2 class="mb-3 text-2xl font-bold text-[#111218]">Changes to Terms</h2>
				<p class="text-[#111218]">
					We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the Service. Your continued use of the Service after changes constitutes acceptance of the modified terms.
				</p>
			</section>

			<section>
				<h2 class="mb-3 text-2xl font-bold text-[#111218]">Contact</h2>
				<p class="text-[#111218]">
					For questions about these Terms of Service, contact us at
					<a href="mailto:legal@pricetracker.com" class="text-primary hover:underline">
						legal@pricetracker.com
					</a>.
				</p>
			</section>
		</div>
	</div>
</div>
