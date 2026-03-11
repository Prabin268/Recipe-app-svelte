<script lang="ts">
	import { Bookmark } from 'lucide-svelte';
	import { savedMeals } from '$lib/stores/savedMeals';
	import type { Meal } from '$lib/api/meals';
	import { goto } from '$app/navigation';

	export let meal: Meal;

	let isSaved: boolean = false;

	$: isSaved = $savedMeals.some((m) => m.id === meal.idMeal);

	function toggleSaveMeal(): void {
		savedMeals.toggle(meal);
	}

	function openRecipe(): void {
		goto(`/recipe/${meal.idMeal}`);
	}
</script>

<div class="min-h-30 w-full">
	<div class="flex flex-col">
		<div class="relative top-5 z-10 flex items-center justify-center">
			<img src={meal.strMealThumb} alt={meal.strMeal} class="h-30 w-30 rounded-full object-cover" />

			<div class="absolute top-12 right-0">
				<img src="/Rating2.png" alt="star2" class="h-7 w-15" />
			</div>
		</div>

		<div
			role="button"
			tabindex="0"
			class="relative bottom-3 flex h-40 min-h-40 w-40 cursor-pointer flex-col gap-5 rounded-lg bg-gray-200 p-2"
			on:click={openRecipe}
			on:keydown={(e: KeyboardEvent) => e.key === 'Enter' && openRecipe()}
		>
			<h1 class="relative top-10 truncate text-center text-xl font-bold text-gray-500">
				{meal.strMeal}
			</h1>

			<div class="relative top-10 flex w-full items-center justify-between">
				<div class="flex flex-col">
					<p class="text-lg text-gray-500">Time</p>
					<h2 class="font-medium">10 Mins</h2>
				</div>

				<div class="flex min-h-10 w-10 items-center justify-center rounded-full bg-white">
					<button
						type="button"
						aria-label="toggle-save-meal"
						class={isSaved ? 'text-green-600' : 'text-gray-300'}
						on:click={(e) => {
							e.stopPropagation();
							toggleSaveMeal();
						}}
					>
						<Bookmark />
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
