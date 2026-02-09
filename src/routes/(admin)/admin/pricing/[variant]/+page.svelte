<script lang="ts">
	import type { PageData } from './$types';
	import { Badge } from '$lib/components/ui/badge';
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { PageHeader, SectionCard, InfoBox } from '$lib/components/admin';

	let { data }: { data: PageData } = $props();

	const variantInfo: Record<string, { description: string; features: string[] }> = {
		launch_promo: {
			description: 'Free tier + discounted Pro plan. Best for launch periods to build user base.',
			features: [
				'Free tier with limited tracking',
				'Discounted Pro plan pricing',
				'Promotional banner on pricing page',
				'Time-limited special offer'
			]
		},
		pay_per_event: {
			description:
				'Free first event, then fixed cost per additional tracked event. Good for casual users.',
			features: [
				'First event completely free',
				'Fixed cost per additional event',
				'No subscription commitment',
				'Pay only for what you use'
			]
		},
		percentage_savings: {
			description:
				'Free to track, pay a percentage of money saved. Aligns incentives with user success.',
			features: [
				'Free tracking for all events',
				'Only pay when you save money',
				'Percentage-based fee',
				'Aligned incentives with users'
			]
		},
		pay_per_sms_tips: {
			description:
				'Free tracking, pay per SMS (covers costs), optional tips. Transparent cost structure.',
			features: [
				'Free event tracking',
				'Pay only for SMS notifications',
				'Optional tip-based support',
				'Transparent pricing model'
			]
		},
		tips_only: {
			description: 'Completely free with optional tips. Best for maximizing user acquisition.',
			features: [
				'100% free tracking and notifications',
				'Optional voluntary tips',
				'No payment required',
				'Maximum user acquisition'
			]
		}
	};
</script>

<svelte:head>
	<title>{data.variantName} - Pricing Configuration</title>
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

<div class="space-y-6">
	<!-- Header with Back Button -->
	<div class="flex items-center gap-4">
		<button
			onclick={() => goto(resolve('/admin/pricing'))}
			class="flex items-center gap-2 rounded-xl px-3 py-2 text-[#616889] transition-all hover:bg-[#f6f6f8] hover:text-[#111218]"
		>
			<span class="material-symbols-outlined">arrow_back</span>
			<span class="font-medium">Back to Pricing</span>
		</button>
	</div>

	<PageHeader title={data.variantName} description="Configure settings for this pricing variant">
		{#if data.isActive}
			<Badge class="border-green-200 bg-green-100 text-green-800">Currently Default</Badge>
		{:else}
			<Badge class="border-gray-200 bg-gray-100 text-gray-800">Available</Badge>
		{/if}
	</PageHeader>

	<!-- Variant Description -->
	<SectionCard>
		<h2 class="mb-3 text-lg font-bold text-[#111218]">About This Variant</h2>
		<p class="mb-4 text-[#616889]">{variantInfo[data.variant].description}</p>
		<h3 class="mb-2 text-sm font-semibold text-[#111218]">Features:</h3>
		<ul class="space-y-1">
			{#each variantInfo[data.variant].features as feature (feature)}
				<li class="flex items-start gap-2 text-sm text-[#616889]">
					<span class="material-symbols-outlined text-primary text-base">check_circle</span>
					<span>{feature}</span>
				</li>
			{/each}
		</ul>
	</SectionCard>

	<!-- Make Default Button -->
	{#if !data.isActive}
		<InfoBox title="Make This the Default Variant" variant="info">
			<div class="flex items-start justify-between gap-4">
				<p class="text-sm leading-relaxed">
					Set this as the default pricing model shown to users on the pricing page. All variants
					remain available via Statsig.
				</p>
				<form method="POST" action="?/makeActive" use:enhance>
					<button
						type="submit"
						class="bg-primary hover:bg-primary/90 rounded-xl px-6 py-2.5 text-sm font-bold whitespace-nowrap text-white shadow-sm transition-all hover:shadow-md"
					>
						Make Default
					</button>
				</form>
			</div>
		</InfoBox>
	{/if}

	<!-- Cost Settings -->
	<SectionCard
		title="Cost Settings"
		description="Configure the costs for this variant. These values are only used when this variant is active."
	>
		<form method="POST" action="?/updateCosts" use:enhance class="space-y-6">
			<!-- Pay Per Event Cost -->
			<div>
				<label class="mb-2 block text-sm font-medium text-[#111218]">
					Cost Per Event
					<span class="text-xs font-normal text-[#616889]">
						(Used by "Pay Per Event" variant)
					</span>
				</label>
				<div class="relative">
					<span class="absolute top-1/2 left-4 -translate-y-1/2 font-medium text-[#616889]">
						$
					</span>
					<input
						type="number"
						name="payPerEventCost"
						value={data.currentConfig.payPerEventCost || 0.99}
						min="0"
						step="0.01"
						class="focus:border-primary focus:ring-primary/20 w-full rounded-xl border border-[#dbdde6] py-2 pr-4 pl-8 text-[#111218] shadow-sm transition-all focus:ring-2 focus:outline-none"
					/>
				</div>
				<p class="mt-1 text-xs text-[#616889]">
					Price charged for each tracked event after the first free one
				</p>
			</div>

			<!-- Percentage Savings -->
			<div>
				<label class="mb-2 block text-sm font-medium text-[#111218]">
					Percentage of Savings
					<span class="text-xs font-normal text-[#616889]">
						(Used by "Percentage Savings" variant)
					</span>
				</label>
				<div class="relative">
					<input
						type="number"
						name="percentageSavings"
						value={data.currentConfig.percentageSavings || 10}
						min="0"
						max="100"
						class="focus:border-primary focus:ring-primary/20 w-full rounded-xl border border-[#dbdde6] px-4 py-2 pr-12 text-[#111218] shadow-sm transition-all focus:ring-2 focus:outline-none"
					/>
					<span class="absolute top-1/2 right-4 -translate-y-1/2 text-[#616889]">%</span>
				</div>
				<p class="mt-1 text-xs text-[#616889]">
					Percentage of the price savings that users pay (e.g., 10% of $50 saved = $5 fee)
				</p>
			</div>

			<!-- SMS Per Message Cost -->
			<div>
				<label class="mb-2 block text-sm font-medium text-[#111218]">
					Cost Per SMS
					<span class="text-xs font-normal text-[#616889]">
						(Used by "Pay Per SMS + Tips" variant)
					</span>
				</label>
				<div class="relative">
					<span class="absolute top-1/2 left-4 -translate-y-1/2 font-medium text-[#616889]">
						$
					</span>
					<input
						type="number"
						name="smsPerMessageCost"
						value={data.currentConfig.smsPerMessageCost || 0.05}
						min="0"
						step="0.01"
						class="focus:border-primary focus:ring-primary/20 w-full rounded-xl border border-[#dbdde6] py-2 pr-4 pl-8 text-[#111218] shadow-sm transition-all focus:ring-2 focus:outline-none"
					/>
				</div>
				<p class="mt-1 text-xs text-[#616889]">
					Price charged per SMS notification sent (to cover Plivo costs)
				</p>
			</div>

			<div class="flex gap-3">
				<button
					type="submit"
					class="bg-primary hover:bg-primary/90 rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:shadow-md"
				>
					Save Cost Settings
				</button>
				<button
					type="button"
					onclick={() => window.location.reload()}
					class="rounded-xl border border-[#dbdde6] px-6 py-2.5 text-sm font-bold text-[#111218] shadow-sm transition-all hover:bg-[#f6f6f8] hover:shadow-md"
				>
					Reset
				</button>
			</div>
		</form>
	</SectionCard>

	<!-- Info Box -->
	<InfoBox title="How Costs Work" variant="info">
		<ul class="space-y-1 text-sm text-[#616889]">
			<li>• All three cost settings are stored globally</li>
			<li>• Only the relevant cost is used when a variant is active</li>
			<li>• You can configure costs for all variants, then switch between them</li>
			<li>• Changes to costs don't require making the variant active</li>
		</ul>
	</InfoBox>
</div>
