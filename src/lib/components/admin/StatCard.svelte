<script lang="ts">
	interface Props {
		label: string;
		value: string | number;
		icon?: string; // Material Symbols icon name
	}

	let { label, value, icon }: Props = $props();
</script>

<div
	class="flex items-center justify-between rounded-2xl border border-[#dbdde6] bg-white p-6 shadow-sm transition-all hover:shadow-md"
>
	<div>
		<p class="text-sm font-medium text-[#616889]">{label}</p>
		<p class="mt-1 text-3xl font-black text-[#111218]">{value}</p>
	</div>
	{#if icon}
		<div class="bg-primary/10 flex h-14 w-14 items-center justify-center rounded-xl">
			<span class="material-symbols-outlined text-primary text-3xl">
				{icon}
			</span>
		</div>
	{/if}
</div>
