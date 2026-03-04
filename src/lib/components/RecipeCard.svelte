<script lang="ts">
	import { Bookmark } from 'lucide-svelte';
	import { savedMeals } from '$lib/stores/savedMeals';
	import type { Meal } from '$lib/api/meals';

	export let meal: Meal;

	let isSaved: boolean = false;

	$: isSaved = $savedMeals.some((m) => m.id === meal.idMeal);

	function toggleSaveMeal(): void {
		savedMeals.toggle(meal);
	}
</script>

<div class="min-h-30 w-full">
	<div class="flex flex-col">
		<div class="relative top-5 z-10 flex items-center justify-center">
			<img
				src={meal.strMealThumb}
				alt={meal.strMeal}
				class="h-30 w-30 rounded-full object-cover"
			/>

			<div class="absolute top-12 right-0">
				<img src="/Rating2.png" alt="star2" class="h-7 w-15" />
			</div>
		</div>

		<div
			class="relative bottom-3 flex h-40 min-h-40 w-40 flex-col gap-5 rounded-lg bg-gray-200 p-2"
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
						on:click={toggleSaveMeal}
					>
						<Bookmark fill={isSaved ? 'currentColor' : 'none'} />
					</button>
				</div>
			</div>
		</div>
	</div>
</div>