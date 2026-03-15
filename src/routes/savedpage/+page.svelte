<script lang="ts">
	import { onMount } from 'svelte';
	import { Bookmark, ArrowLeft, Timer, Star } from 'lucide-svelte';
	import { savedMeals } from '$lib/stores/savedMeals';
	import { goto } from '$app/navigation';
	import SavedSkeleton from '$lib/components/SavedSkeleton.svelte';

	interface SavedMeal {
		id: string;
		name: string;
		image: string;
	}

	let isLoading: boolean = true;

	onMount(() => {
		setTimeout(() => (isLoading = false), 500);
	});

	function removeMeal(mealId: string, e: MouseEvent): void {
		e.stopPropagation();
		savedMeals.remove(mealId);
	}

	function goBack(): void {
    goto('/homepage');
  }
</script>

<div class="w-full min-h-screen p-4 md:p-10">

	<div class="flex justify-between items-center mb-2 md:justify-center md:items-center md:mb-5">

		<button class="flex text-left md:hidden" on:click={goBack}>
			<ArrowLeft />
		</button>
		
		<h1 class="flex-1 text-center text-2xl font-semibold">Saved Recipes</h1>

	</div>

	{#if isLoading}
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each Array(6) as _}
				<SavedSkeleton />
			{/each}
		</div>
	{:else if $savedMeals.length === 0}
		<p class="mt-10 text-center text-gray-500">No saved recipes yet.</p>
	{:else}
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each $savedMeals as meal (meal.id)}
				<div
					role="button"
					tabindex="0"
					class="relative h-40 w-full cursor-pointer overflow-hidden rounded-lg shadow md:h-48"
					on:click={() => goto(`/recipe/${meal.id}`)}
					on:keydown={(e: KeyboardEvent) => e.key === 'Enter' && goto(`/recipe/${meal.id}`)}
				>
					<div
						class="absolute inset-0 bg-cover bg-center"
						style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,1)),url({meal.image})"
					></div>

					<div class="flex justify-center items-center gap-1 absolute top-2 right-2 rounded-xl w-15  bg-orange-200">
							<Star fill="orange" color="orange" size="15"/><h1>
                                 4.0
							</h1>
						 </div>

					<div class="absolute right-3 bottom-10 left-3 z-10 text-white">
						<h2 class="truncate text-lg font-bold">
							{meal.name}
						</h2>
					</div>

					<div class="absolute right-3 bottom-3 left-3 z-10 flex items-center justify-between">
						<p class="text-sm font-semibold text-white">By Chef John</p>

						<div class="flex gap-2">
							<div class="flex justify-center items-center text-white h-10 w-20">
						<Timer /> <h1>20 mins</h1>
					 </div>
							
							
							<button
							type="button"
							class="flex justify-center items-center rounded-full h-8 w-8 bg-white p-1 text-green-600"
							on:click={(e: MouseEvent) => removeMeal(meal.id, e)}
						>
							<Bookmark size="18" />
						</button>
					</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>