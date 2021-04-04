<script lang="ts">
	import Counter from '$lib/Counter.svelte';
	import JamesAlgebraFormViz from '$lib/JamesAlgebraFormViz.svelte';
</script>

<main>
	<Counter />

	<p>example iconic arithmetic forms</p>

	<JamesAlgebraFormViz />
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}

	p {
		max-width: 14rem;
		margin: 2rem auto;
		line-height: 1.35;
	}

	@media (min-width: 480px) {
		p {
			max-width: none;
		}
	}
</style>
