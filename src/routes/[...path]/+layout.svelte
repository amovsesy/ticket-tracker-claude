<script lang="ts">
	import '../../app.css';

	let { children } = $props();
</script>

<main
	class="flex flex-col items-center justify-center gap-10 px-6 py-20 text-center md:flex-row md:text-left"
>
	{@render children()}
</main>
