<script lang="ts">
	import { onMount } from 'svelte';

	let showAnimation = false;

	onMount(() => {
		showAnimation = true;
	});
</script>

<div class="container mx-auto max-w-4xl px-4 py-8">
	<div class="mb-12 text-center">
		<h1 class="mb-4 text-4xl font-bold text-indigo-600">Our Story</h1>
		<p class="mx-auto max-w-2xl text-lg text-gray-600">
			How a quest for Taylor Swift tickets turned into something bigger
		</p>
	</div>

	<div class="grid gap-12">
		<div class="order-2 md:order-1">
			<div
				class="prose prose-lg max-w-none transition-all duration-250 ease-in-out"
				class:opacity-0={!showAnimation}
				class:translate-y-8={!showAnimation}
				class:opacity-100={showAnimation}
				class:translate-y-0={showAnimation}
			>
				<h2>It Started With Love (and Taylor Swift)</h2>
				<p>
					In early 2024, my wife was determined to see Taylor Swift's Eras Tour. Like millions of
					Swifties around the world, she found herself facing the challenge of finding tickets that
					wouldn't break the bank.
				</p>
				<p>
					As ticket prices fluctuated wildly in the weeks leading up to the concert, I noticed
					something interesting: prices would often drop significantly for specific sections, but
					only for brief periods. If you weren't constantly checking, you'd miss these
					opportunities.
				</p>
				<h2>The Breakthrough</h2>
				<p>
					I built a simple tool that would track the sections my wife was interested in and alert us
					when prices dropped below a certain threshold. Within a week, we were notified of a price
					drop in her preferred section.
				</p>
				<p>
					<strong>The result?</strong> We saved hundreds of dollars per ticket and secured seats in exactly
					the area she wanted to sit in.
				</p>
				<h2>From Personal Tool to Public Service</h2>
				<p>
					After sharing our success story with friends, I realized this tool could help many others
					facing the same challenge. Whether it's concerts, sports events, or theater performances,
					people everywhere want to attend live events without paying inflated prices.
				</p>
				<p>
					And so, Ticket Price Insights was born – a service dedicated to helping people find the
					best deals on tickets for the events they love.
				</p>
				<h2>Our Mission</h2>
				<p>
					We believe that everyone should be able to experience the joy of live events without
					financial strain. Our mission is to make ticket buying more transparent and affordable by
					giving you the tools to track prices and make informed decisions.
				</p>
				<p>
					What started as a labor of love has grown into a platform that helps thousands of
					event-goers save money and attend the events that matter most to them.
				</p>
			</div>
		</div>
	</div>

	<div
		class="mt-16 rounded-lg bg-indigo-50 p-8 text-center transition-all duration-250 ease-in-out"
		class:opacity-0={!showAnimation}
		class:translate-y-8={!showAnimation}
		class:opacity-100={showAnimation}
		class:translate-y-0={showAnimation}
	>
		<h2 class="mb-4 text-2xl font-bold text-indigo-600">Want to Get Involved?</h2>
		<p class="mb-6 text-lg text-gray-700">
			We're looking for passionate people to help us build and improve Ticket Price Insights.
		</p>
		<a
			href="mailto:careers@ticketpriceinsights.com"
			class="inline-block rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
		>
			Contact Our Team
		</a>
	</div>
</div>
