<script lang="ts">
	interface Props {
		message: string;
		icon?: string; // Material Symbols icon name
		colspan?: number;
	}

	let { message, icon = 'inbox', colspan = 1 }: Props = $props();
</script>

<tr>
	<td {colspan} class="px-6 py-12 text-center">
		<div class="flex flex-col items-center gap-3">
			<div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f6f6f8]">
				<span class="material-symbols-outlined text-4xl text-[#616889]">
					{icon}
				</span>
			</div>
			<p class="text-sm font-medium text-[#616889]">{message}</p>
		</div>
	</td>
</tr>
