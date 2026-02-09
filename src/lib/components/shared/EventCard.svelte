<script lang="ts">
	import { resolve } from '$app/paths';
	interface Props {
		event: {
			eventName: string;
			venue: string;
			date: Date;
			section: string;
			imageUrl: string;
			targetPrice: number;
			currentLowestPrice: number;
			percentageChange: number;
		};
		href: string;
	}

	let { event, href }: Props = $props();

	function formatDate(date: Date) {
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
		}).format(new Date(date));
	}

	function formatPrice(price: number) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0
		}).format(price);
	}
</script>

<a
	href={resolve(href)}
	data-sveltekit-preload-data
	class="flex flex-col overflow-hidden rounded-2xl border border-[#dbdde6] bg-white shadow-sm transition-all hover:shadow-md"
>
	<!-- Event Image -->
	<div
		class="relative aspect-[21/9] w-full bg-cover bg-center bg-no-repeat"
		style="background-image: url('{event.imageUrl}');"
	>
		{#if event.percentageChange < 0}
			<div
				class="absolute top-2 right-2 rounded-full bg-green-500 px-2 py-1 text-[10px] font-bold tracking-wider text-white uppercase"
			>
				Price Drop
			</div>
		{/if}
	</div>

	<!-- Card Content -->
	<div class="flex flex-col gap-3 p-4 text-left">
		<div>
			<p class="text-primary mb-1 text-[10px] font-bold tracking-wider uppercase">
				{event.section}
			</p>
			<h3 class="text-base leading-tight font-bold text-[#111218]">{event.eventName}</h3>
			<p class="mt-1 text-xs text-[#616889]">
				{event.venue} • {formatDate(event.date)}
			</p>
		</div>

		<!-- Price Stats -->
		<div class="flex gap-4 border-t border-gray-100 pt-2">
			<div class="flex-1">
				<p class="text-[10px] font-semibold text-[#616889] uppercase">Threshold</p>
				<p class="text-lg font-bold text-[#111218]">&lt;{formatPrice(event.targetPrice)}</p>
			</div>
			<div class="flex-1">
				<p class="text-[10px] font-semibold text-[#616889] uppercase">Lowest</p>
				<div class="flex items-center gap-1">
					<p
						class="text-lg font-bold {event.percentageChange < 0
							? 'text-green-600'
							: 'text-[#111218]'}"
					>
						{formatPrice(event.currentLowestPrice)}
					</p>
					{#if event.percentageChange !== 0}
						<span
							class="rounded px-1 text-[10px] font-bold {event.percentageChange < 0
								? 'bg-green-50 text-green-600'
								: 'bg-red-50 text-red-500'}"
						>
							{event.percentageChange > 0 ? '+' : ''}{event.percentageChange.toFixed(0)}%
						</span>
					{/if}
				</div>
			</div>
		</div>
	</div>
</a>
