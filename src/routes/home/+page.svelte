<script lang="ts">
	import SearchBar from '$lib/components/SearchBar.svelte';
	import RecipeCard from '$lib/components/RecipeCard.svelte';
	import {
		getAreas,
		getRandomMeals,
		searchMeals,
		getMealsByArea,
		getCategories
	} from '$lib/api/meals';
	import { onMount } from 'svelte';
	import RecipeCardSkeleton from '$lib/components/RecipeCardSkeleton.svelte';
	import NewRecipesSkeleton from '$lib/components/NewRecipesSkeleton.svelte';
	import { goto } from '$app/navigation';
	import type { Meal, Area, Category } from '$lib/api/meals';
	import { userStore } from '$lib/stores/user';
	import { get } from 'svelte/store';
	import Rating from '$lib/assets/Rating.png';
	import Creator from '$lib/assets/Creator.png';
	import Time from '$lib/assets/Time.png';

	let areas: Area[] = [];
	let allMeals: Meal[] = [];
	let meals: Meal[] = [];
	let activeArea: string = 'All';
	let mealsLoading = false;
	let newRecipesLoading = false;
	let newRecipes: Meal[] = [];
	let categories: Category[] = [];

	onMount(async () => {
		mealsLoading = true;
		newRecipesLoading = true;
		try {
			const rawAreas = await getAreas();
			areas = [...new Map(rawAreas.map((a) => [a.strArea, a])).values()];

			const rawMeals = await searchMeals('');
			allMeals = [...new Map(rawMeals.map((m) => [m.idMeal, m])).values()];
			meals = allMeals;

			newRecipes = await getRandomMeals();
			categories = await getCategories();
		} catch (err) {
			console.error('Failed to load data:', err);
		} finally {
			mealsLoading = false;
			newRecipesLoading = false;
		}
	});

	async function selectArea(area: string) {
		activeArea = area;

		if (area === 'All') {
			meals = allMeals;
			return;
		}

		mealsLoading = true;
		try {
			const rawMeals = await getMealsByArea(area);
			const filtered = [...new Map(rawMeals.map((m) => [m.idMeal, m])).values()];

			meals = filtered.length > 0 ? filtered : allMeals;
		} catch (err) {
			console.error('Failed to load meals for area:', err);
			meals = allMeals;
		} finally {
			mealsLoading = false;
		}
	}

	function pushYoutube(strYoutube?: string) {
		if (!strYoutube) return;
		localStorage.setItem('currentYoutube', strYoutube);
	}

	function openRecipe(id: string) {
		goto(`/recipe/${id}`);
	}
</script>

<div class="flex min-h-screen flex-col gap-2 bg-white p-3 md:p-10">
	<div class="mt-5 flex justify-between gap-2 md:flex-row md:items-center">
		<div>
			<h1 class="text-2xl font-bold md:text-3xl">
				Hello {get(userStore)?.display_name}
			</h1>
			<p class="text-base md:text-xl">What are you cooking today?</p>
		</div>
		<button class="cursor-pointer" on:click={() => goto('/profile')}>
			<img
				src={get(userStore)?.photo_url}
				alt="avatar"
				class="h-14 w-14 rounded-xl bg-orange-300 md:h-16 md:w-16"
			/>
		</button>
	</div>

	<SearchBar
		enableNavigation={true}
		categories={categories.map((c) => c.strCategory ?? '').filter(Boolean)}
		on:openSearch={() => goto('/search')}
		on:categorySelect={(e: CustomEvent<string>) => {
			const cat = e.detail;
			if (cat) {
				localStorage.setItem('fromHome', 'true');
				goto(`/search?category=${encodeURIComponent(cat)}`);
			}
		}}
	/>

	<div class="mt-2 mb-2 flex gap-1 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden">
		<button
			class="cursor-pointer rounded-xl px-4 py-2 transition {activeArea === 'All'
				? 'bg-green-600 text-white'
				: 'bg-gray-200'}"
			on:click={() => selectArea('All')}
		>
			All
		</button>

		{#each areas as area (area.strArea)}
			<button
				class="cursor-pointer rounded-xl px-4 py-2 transition {activeArea === area.strArea
					? 'bg-green-600 text-white'
					: 'bg-gray-200'}"
				on:click={() => selectArea(area.strArea ?? '')}
			>
				{area.strArea}
			</button>
		{/each}
	</div>

	{#if mealsLoading}
		<div class="flex min-w-0 gap-5 overflow-x-auto p-2 [&::-webkit-scrollbar]:hidden">
			{#each Array.from({ length: 10 }) as _}
				<RecipeCardSkeleton />
			{/each}
		</div>
	{:else}
		<div class="flex min-w-0 gap-5 overflow-x-auto p-2 [&::-webkit-scrollbar]:hidden">
			{#each meals as meal (meal.idMeal)}
				<div>
					<RecipeCard {meal} on:click={() => pushYoutube(meal.strYoutube)} />
				</div>
			{/each}
		</div>
	{/if}

	{#if newRecipesLoading}
		<div class="flex gap-5 overflow-x-auto p-2 [&::-webkit-scrollbar]:hidden">
			{#each Array.from({ length: 6 }) as _}
				<NewRecipesSkeleton />
			{/each}
		</div>
	{:else}
		<div class="flex h-auto flex-col p-2">
			<p class="text-2xl font-bold">New Recipes</p>
			<div
				class="flex h-42 items-center gap-4 overflow-x-auto md:h-50 [&::-webkit-scrollbar]:hidden"
			>
				{#each newRecipes as recipe (recipe.idMeal)}
					<div
						role="button"
						tabindex="0"
						class="relative flex w-65 shrink-0 cursor-pointer flex-col rounded-lg bg-gray-50 p-2 shadow transition hover:scale-105 md:w-70"
						on:click={() => openRecipe(recipe.idMeal)}
						on:keydown={(e: KeyboardEvent) => e.key === 'Enter' && openRecipe(recipe.idMeal)}
					>
						<div class="p-2 w-50">
							<h1 class="truncate text-lg font-semibold">{recipe.strMeal}</h1>
							<img src={Rating} alt="rating" class="h-5 w-25" />
						</div>
						<img
							src={recipe.strMealThumb}
							alt={recipe.strMeal}
							class="absolute -top-5 right-3 h-14 w-14 rounded-full object-cover md:h-15 md:w-15"
						/>
						<div class="flex gap-8 p-2">
							<img src={Creator} alt="creator" />
							<img src={Time} alt="time" />
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>