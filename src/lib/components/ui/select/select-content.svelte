<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';
	import { cn, flyAndScale } from '$lib/utils.js';

	type $$Props = SelectPrimitive.ContentProps;

	let className: $$Props['class'] = undefined;
	export let transition: $$Props['transition'] = flyAndScale;
	export let transitionConfig: $$Props['transitionConfig'] = undefined;
	export { className as class };
</script>

<SelectPrimitive.Content
	{transition}
	{transitionConfig}
	class={cn(
		'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-xl border border-[#dbdde6] bg-white text-[#111218] shadow-xl outline-none',
		className
	)}
	{...$$restProps}
>
	<div class="w-full p-1.5">
		<slot />
	</div>
</SelectPrimitive.Content>
