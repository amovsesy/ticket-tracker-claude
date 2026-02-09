<script lang="ts">
	import type { PageData } from './$types';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Badge } from '$lib/components/ui/badge';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { PageHeader, SectionCard, DataTable, InfoBox } from '$lib/components/admin';

	let { data }: { data: PageData } = $props();

	let submitting = $state(false);

	const variantInfo = {
		launch_promo: {
			name: 'Launch Promo',
			description: 'Free tier + discounted Pro plan for launch period'
		},
		pay_per_event: {
			name: 'Pay Per Event',
			description: 'Free first event, then fixed cost per additional event'
		},
		percentage_savings: {
			name: 'Percentage Savings',
			description: 'Free to track, pay percentage of money saved'
		},
		pay_per_sms_tips: {
			name: 'Pay Per SMS + Tips',
			description: 'Free tracking, pay per SMS, optional tips'
		},
		tips_only: {
			name: 'Tips Only',
			description: 'Completely free with optional tips'
		}
	};

	async function setActiveVariant(variant: string) {
		submitting = true;
		const formData = new FormData();
		formData.append('variant', variant);
		formData.append('promoEnabled', data.currentConfig.promoEnabled.toString());
		formData.append('promoDiscount', data.currentConfig.promoDiscount.toString());
		formData.append('promoMessage', data.currentConfig.promoMessage || '');
		formData.append('payPerEventCost', data.currentConfig.payPerEventCost?.toString() || '0.99');
		formData.append('percentageSavings', data.currentConfig.percentageSavings?.toString() || '10');
		formData.append(
			'smsPerMessageCost',
			data.currentConfig.smsPerMessageCost?.toString() || '0.05'
		);

		try {
			const response = await fetch('?/updateConfig', {
				method: 'POST',
				body: formData
			});
			if (response.ok) {
				window.location.reload();
			}
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Pricing Configuration - Admin</title>
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
	<PageHeader
		title="Pricing Configuration"
		description="Manage pricing variants and promotional settings"
	/>

	<!-- Current Default Variant -->
	<SectionCard title="Current Default">
		<div class="mb-4 flex items-center justify-between">
			<div class="flex-1 space-y-2">
				<div class="flex items-center gap-2">
					<span class="font-semibold text-[#111218]">Variant:</span>
					<Badge class="bg-primary text-white">
						{data.variantDescriptions[data.currentConfig.variant]}
					</Badge>
				</div>
				<div class="flex items-center gap-2">
					<span class="font-semibold text-[#111218]">Promo:</span>
					{#if data.currentConfig.promoEnabled}
						<Badge variant="destructive">{data.currentConfig.promoDiscount}% OFF</Badge>
						<span class="text-sm text-[#616889]">{data.currentConfig.promoMessage}</span>
					{:else}
						<span class="text-sm text-[#616889]">Disabled</span>
					{/if}
				</div>
				<div class="text-xs text-[#616889]">
					Last updated: {new Date(data.currentConfig.updatedAt).toLocaleString()}
				</div>
			</div>
			<Badge class="border-green-200 bg-green-100 text-green-800">Live</Badge>
		</div>
	</SectionCard>

	<!-- Promotional Settings -->
	<SectionCard
		title="Promotional Settings"
		description="These settings apply to all pricing variants and are shown in banners on the pricing page."
	>
		<form method="POST" action="?/updatePromo" use:enhance class="flex flex-wrap items-end gap-4">
			<div class="min-w-[200px] flex-1">
				<label class="mb-2 block text-sm font-medium text-[#111218]">Discount Percentage</label>
				<input
					type="number"
					name="promoDiscount"
					value={data.currentConfig.promoDiscount}
					min="0"
					max="100"
					class="focus:border-primary focus:ring-primary/20 w-full rounded-xl border border-[#dbdde6] px-4 py-2 text-[#111218] shadow-sm transition-all focus:ring-2 focus:outline-none"
				/>
			</div>
			<div class="min-w-[300px] flex-1">
				<label class="mb-2 block text-sm font-medium text-[#111218]">Promotional Message</label>
				<input
					type="text"
					name="promoMessage"
					value={data.currentConfig.promoMessage || ''}
					placeholder="100% Off Pro Plan - Launch Special"
					class="focus:border-primary focus:ring-primary/20 w-full rounded-xl border border-[#dbdde6] px-4 py-2 text-[#111218] shadow-sm transition-all placeholder:text-[#616889] focus:ring-2 focus:outline-none"
				/>
			</div>
			<div class="flex items-center gap-3">
				<input
					type="checkbox"
					id="promoEnabled"
					name="promoEnabled"
					value="true"
					checked={data.currentConfig.promoEnabled}
					class="text-primary accent-primary h-5 w-5 rounded-lg border-[#dbdde6] transition-all"
				/>
				<label for="promoEnabled" class="text-sm font-medium text-[#111218]">Enabled</label>
			</div>
			<button
				type="submit"
				class="bg-primary hover:bg-primary/90 rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:shadow-md"
			>
				Save Promo Settings
			</button>
		</form>
	</SectionCard>

	<!-- Pricing Variants Table -->
	<DataTable headers={['Variant', 'Description', 'Status', 'Actions']}>
		{#each Object.entries(variantInfo) as [key, info] (key)}
			<tr class="hover:bg-[#f6f6f8]">
				<td class="px-6 py-4 whitespace-nowrap">
					<button
						onclick={() => goto(resolve(`/admin/pricing/${key}`))}
						class="hover:text-primary font-medium text-[#111218]"
					>
						{info.name}
					</button>
				</td>
				<td class="px-6 py-4">
					<span class="text-sm text-[#616889]">{info.description}</span>
				</td>
				<td class="px-6 py-4 whitespace-nowrap">
					{#if data.currentConfig.variant === key}
						<Badge class="border-green-200 bg-green-100 text-green-800">Default</Badge>
					{:else}
						<Badge class="border-gray-200 bg-gray-100 text-gray-800">Available</Badge>
					{/if}
				</td>
				<td class="px-6 py-4 text-right whitespace-nowrap">
					<DropdownMenu.Root>
						<DropdownMenu.Trigger
							class="rounded-xl border border-[#dbdde6] px-4 py-2 text-sm font-medium text-[#111218] shadow-sm transition-all hover:shadow-md"
						>
							Actions ▾
						</DropdownMenu.Trigger>
						<DropdownMenu.Content class="bg-white">
							<DropdownMenu.Item onclick={() => goto(resolve(`/admin/pricing/${key}`))}>
								<span class="flex items-center gap-2 text-[#111218]">
									<span class="material-symbols-outlined text-base">edit</span>
									<span>Edit Settings</span>
								</span>
							</DropdownMenu.Item>
							{#if data.currentConfig.variant !== key}
								<DropdownMenu.Item onclick={() => setActiveVariant(key)} disabled={submitting}>
									<span class="flex items-center gap-2 text-[#111218]">
										<span class="material-symbols-outlined text-base">check_circle</span>
										<span>Make Default</span>
									</span>
								</DropdownMenu.Item>
							{/if}
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</td>
			</tr>
		{/each}
	</DataTable>

	<!-- Help Section -->
	<InfoBox title="How It Works" variant="info">
		<ul class="space-y-1 text-sm text-[#616889]">
			<li>• Click on a variant name or "Edit Settings" to configure its specific costs</li>
			<li>• Use "Make Default" to switch which pricing model is shown by default</li>
			<li>• All variants are available via Statsig; this sets the default shown to users</li>
			<li>• Promotional settings apply to all variants</li>
			<li>• Changes take effect immediately on the public pricing page</li>
		</ul>
	</InfoBox>
</div>
