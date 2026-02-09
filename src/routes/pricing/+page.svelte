<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import PricingVariants from '$lib/components/pricing/PricingVariants.svelte';
	import clerkStore from '$lib/components/clerk/store';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let clerk = $state($clerkStore);
	let isSignedIn = $derived(clerk?.user != null);

	clerkStore.subscribe((value) => {
		clerk = value;
	});
</script>

<div
	class="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900"
>
	<!-- Header -->
	<div class="bg-card border-b">
		<div class="container mx-auto px-4 py-6">
			<div class="flex items-center justify-between">
				<h1 class="text-2xl font-bold">Pricing</h1>
				<Button href={isSignedIn ? '/dashboard' : '/'} variant="ghost">
					{isSignedIn ? 'Back to Dashboard' : 'Back to Home'}
				</Button>
			</div>
		</div>
	</div>

	<div class="container mx-auto px-4 py-12">
		<!-- Promo Banner -->
		{#if data.pricingConfig.promoEnabled && data.pricingConfig.promoMessage}
			<div
				class="border-primary/20 bg-primary/5 dark:bg-primary/10 mb-12 rounded-lg border p-6 text-center"
			>
				<Badge class="mb-2">Launch Special</Badge>
				<h2 class="mb-2 text-2xl font-bold">{data.pricingConfig.promoMessage}</h2>
				<p class="text-muted-foreground">
					Get unlimited event tracking and SMS alerts completely FREE during our launch period!
				</p>
			</div>
		{/if}

		<!-- Pricing Cards -->
		<PricingVariants config={data.pricingConfig} />

		<!-- FAQ Section -->
		<div class="mx-auto mt-16 max-w-3xl">
			<h2 class="mb-8 text-center text-2xl font-bold">Frequently Asked Questions</h2>
			<div class="space-y-4">
				<div class="bg-card rounded-lg border p-6">
					<h3 class="mb-2 font-semibold">Can I change my plan later?</h3>
					<p class="text-muted-foreground text-sm">
						Yes! You can upgrade or downgrade at any time. Changes take effect immediately.
					</p>
				</div>
				<div class="bg-card rounded-lg border p-6">
					<h3 class="mb-2 font-semibold">
						How do you calculate savings for percentage-based pricing?
					</h3>
					<p class="text-muted-foreground text-sm">
						We compare the price when you first started tracking to the lowest price we found. Your
						savings are the difference.
					</p>
				</div>
				<div class="bg-card rounded-lg border p-6">
					<h3 class="mb-2 font-semibold">What payment methods do you accept?</h3>
					<p class="text-muted-foreground text-sm">
						We accept all major credit cards, debit cards, and PayPal. Payment integration coming
						soon!
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
