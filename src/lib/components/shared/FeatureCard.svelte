<script lang="ts">
	interface Props {
		icon: string; // Material Symbols icon name
		title: string;
		description: string;
	}

	let { icon, title, description }: Props = $props();
</script>

<div
	class="hover:border-primary/30 flex flex-col gap-4 rounded-2xl border border-[#dbdde6] bg-[#f6f6f8]/50 p-6 transition-all hover:shadow-sm"
>
	<div class="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl">
		<span class="material-symbols-outlined">{icon}</span>
	</div>
	<div class="flex flex-col gap-2">
		<h3 class="text-lg font-bold text-[#111218]">{title}</h3>
		<p class="text-sm leading-relaxed text-[#616889]">{description}</p>
	</div>
</div>
