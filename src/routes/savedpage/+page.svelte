<script>
	import { onMount } from 'svelte';
	import { Bookmark } from 'lucide-svelte';
	import { savedMeals } from '$lib/stores/savedMeals';
	import { goto } from '$app/navigation';
	import SavedSkeleton from '$lib/components/SavedSkeleton.svelte';

	let isLoading = true;

	onMount(() => {
		setTimeout(() => (isLoading = false), 500);
	});

	function removeMeal(mealId, e) {
		e.stopPropagation();
		savedMeals.remove(mealId);
	}
</script>

<div class="w-full p-4 md:p-10">
	<h1 class="mb-4 text-center text-2xl font-semibold">
		Saved Recipes
	</h1>

	{#if isLoading}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each Array(6) as _}
				<SavedSkeleton />
			{/each}
		</div>

	{:else if $savedMeals.length === 0}
		<p class="mt-10 text-center text-gray-500">
			No saved recipes yet.
		</p>

	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each $savedMeals as meal (meal.id)}
				<div
					role="button"
					tabindex="0"
					class="relative h-40 md:h-48 w-full cursor-pointer overflow-hidden rounded-lg shadow"
					on:click={() => goto(`/recipe/${meal.id}`)}
					on:keydown={(e) => e.key === 'Enter' && goto(`/recipe/${meal.id}`)}
				>
					<div
						class="absolute inset-0 bg-cover bg-center"
						style="background-image: url({meal.image})"
					></div>

					<div class="absolute inset-0 bg-linear-to-t from-black/70 to-transparent"></div>

					<img
						src="/Rating4.0.png"
						alt="Recipe rating"
						class="absolute top-2 right-2 h-6 z-10"
					/>

					<div class="absolute bottom-10 left-3 right-3 z-10 text-white">
						<h2 class="truncate text-lg font-bold">
							{meal.name}
						</h2>
					</div>

					<div class="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between">
						<p class="text-sm font-semibold text-white">By Chef John</p>

						<button
							type="button"
							class="rounded-full bg-white p-1 text-green-600"
							on:click={(e) => removeMeal(meal.id, e)}
						>
							<Bookmark size="18" fill="currentColor" />
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>