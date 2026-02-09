<script lang="ts">
	import Header from '$lib/components/Header.svelte';

	const lastUpdated = 'February 6, 2026';
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

<div class="min-h-screen bg-[#f6f6f8]">
	<Header />
	<div class="container mx-auto max-w-4xl px-4 py-12">
		<h1 class="mb-4 text-4xl font-black text-[#111218]">Privacy Policy</h1>
		<p class="mb-8 text-sm font-medium text-[#616889]">Last Updated: {lastUpdated}</p>

		<div class="space-y-6 rounded-xl bg-white p-8 shadow-sm">
			<section>
				<h2 class="mb-3 text-2xl font-bold text-[#111218]">Introduction</h2>
				<p class="mb-2 text-[#111218]">
					Ticket Price Insights ("we," "our," or "us") is committed to protecting your privacy. This
					Privacy Policy explains how we collect, use, disclose, and safeguard your information when
					you use our event tracking service.
				</p>
				<p class="text-[#111218]">
					Please read this Privacy Policy carefully. By accessing or using our service, you
					acknowledge that you have read, understood, and agree to be bound by all the terms
					outlined in this policy.
				</p>
			</section>

			<section>
				<h2 class="mb-3 text-2xl font-bold text-[#111218]">Information We Collect</h2>
				<p class="mb-2 text-[#111218]">We may collect the following types of information:</p>
				<ul class="ml-6 list-disc space-y-2 text-[#111218]">
					<li>
						<span class="font-medium">Personal Information:</span> Email address, name, and contact information
						you provide when creating an account.
					</li>
					<li>
						<span class="font-medium">Event Data:</span> Information about events you choose to track,
						including URLs, section selections, and price thresholds.
					</li>
					<li>
						<span class="font-medium">Usage Data:</span> Information about how you use our service, including
						log data, device information, and analytics.
					</li>
				</ul>
			</section>

			<section>
				<h2 class="mb-3 text-2xl font-bold text-[#111218]">How We Use Your Information</h2>
				<p class="mb-2 text-[#111218]">We use the information we collect to:</p>
				<ul class="ml-6 list-disc space-y-2 text-[#111218]">
					<li>Provide, maintain, and improve our services</li>
					<li>Process and track the events you've selected</li>
					<li>Send notifications about price changes and event updates</li>
					<li>Respond to your comments, questions, and requests</li>
					<li>Monitor and analyze trends, usage, and activities in connection with our service</li>
				</ul>
			</section>

			<section>
				<h2 class="mb-3 text-2xl font-bold text-[#111218]">Data Sharing and Disclosure</h2>
				<p class="mb-2 text-[#111218]">
					We do not sell your personal information. We may share your information in the following
					circumstances:
				</p>
				<ul class="ml-6 list-disc space-y-2 text-[#111218]">
					<li>With service providers who perform services on our behalf</li>
					<li>To comply with legal obligations</li>
					<li>To protect and defend our rights and property</li>
					<li>With your consent or at your direction</li>
				</ul>
			</section>

			<section>
				<h2 class="mb-3 text-2xl font-bold text-[#111218]">Data Security</h2>
				<p class="text-[#111218]">
					We implement appropriate technical and organizational measures to protect the security of
					your personal information. However, please be aware that no method of transmission over
					the Internet or method of electronic storage is 100% secure.
				</p>
			</section>

			<section>
				<h2 class="mb-3 text-2xl font-bold text-[#111218]">Your Rights</h2>
				<p class="mb-2 text-[#111218]">
					Depending on your location, you may have certain rights regarding your personal
					information, including:
				</p>
				<ul class="ml-6 list-disc space-y-2 text-[#111218]">
					<li>The right to access personal information we hold about you</li>
					<li>The right to request correction or deletion of your personal information</li>
					<li>The right to restrict or object to our processing of your personal information</li>
					<li>The right to data portability</li>
				</ul>
				<p class="mt-2 text-[#111218]">
					To exercise these rights, please contact us using the information provided in the "Contact
					Us" section below.
				</p>
			</section>

			<section>
				<h2 class="mb-3 text-2xl font-bold text-[#111218]">Changes to This Privacy Policy</h2>
				<p class="text-[#111218]">
					We may update our Privacy Policy from time to time. We will notify you of any changes by
					posting the new Privacy Policy on this page and updating the "Last Updated" date at the
					top of this Privacy Policy.
				</p>
			</section>

			<section>
				<h2 class="mb-3 text-2xl font-bold text-[#111218]">Contact Us</h2>
				<p class="text-[#111218]">
					If you have any questions about this Privacy Policy, please contact us at
					<a
						href="mailto:privacy@pricetracker.com"
						data-sveltekit-preload-data
						class="text-primary hover:underline">privacy@pricetracker.com</a
					>.
				</p>
			</section>
		</div>
	</div>
</div>
