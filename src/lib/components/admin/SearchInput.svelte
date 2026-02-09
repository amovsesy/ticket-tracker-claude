<script lang="ts">
	interface Props {
		value: string;
		placeholder?: string;
		onInput?: (value: string) => void;
	}

	let { value = $bindable(), placeholder = 'Search...', onInput }: Props = $props();

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		value = target.value;
		onInput?.(target.value);
	}
</script>

<div class="min-w-[300px] flex-1">
	<div class="flex h-11 w-full items-stretch rounded-xl border border-[#dbdde6] shadow-sm">
		<div class="flex items-center justify-center rounded-l-xl bg-white pl-4 text-[#616889]">
			<span class="material-symbols-outlined text-xl">search</span>
		</div>
		<input
			type="text"
			{value}
			oninput={handleInput}
			{placeholder}
			class="form-input flex h-full w-full min-w-0 flex-1 rounded-r-xl border-none bg-white px-3 text-sm font-normal text-[#111218] placeholder:text-[#616889] focus:ring-0 focus:outline-0"
		/>
	</div>
</div>
