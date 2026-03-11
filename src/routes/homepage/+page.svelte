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

	let query: string = '';
	let areas: Area[] = [];
	let allMeals: Meal[] = [];
	let meals: Meal[] = [];
	let activeArea: string = 'All';
	let mealsLoading: boolean = false;
	let newRecipesLoading: boolean = false;
	let newRecipes: Meal[] = [];
	let categories: Category[] = [];

	let selectedCategory: string = 'All';
	let selectedTime: string = 'All';
	let selectedRate: number | null = null;

	onMount(async () => {
		mealsLoading = true;
		newRecipesLoading = true;
		
		try {
			areas = await getAreas();
			allMeals = await searchMeals('');
			meals = allMeals;
			newRecipes = await getRandomMeals();
			categories = await getCategories();
		} catch (err) {
			console.error('Failed to load meals', err);
		} finally {
			mealsLoading = false;
			newRecipesLoading = false;
		}
	});

	async function selectArea(area: string) {
		activeArea = area;
		mealsLoading = true;
		try {
			if (area === 'All') {
				meals = allMeals;
			} else {
				meals = await getMealsByArea(area);
			}
		} catch (err) {
			console.error('Failed to load meals', err);
		} finally {
			mealsLoading = false;
		}
	}

	function pushYoutube(strYoutube?: string) {
		if (typeof window === 'undefined') return;
		if (!strYoutube) return;
		localStorage.setItem('currentYoutube', strYoutube);
	}

	function navigateToSearch(): void {
		goto('/searchpage');
	}

	function navigateToprofile(): void {
		goto('/profilepage');
	}

	function onCategorySelect(cat: string): void {
		selectedCategory = cat;
		console.log('Category selected:', cat);
	}

	function onApplyFilter(): void {
		console.log('Filter applied!', { selectedCategory, selectedTime, selectedRate });
	}

	function openRecipe(id: string): void {
		goto(`/recipe/${id}`);
	}
</script>

<div class="flex min-h-screen flex-col gap-2 bg-white p-5 md:p-10">
	<div class="mt-5 flex justify-between gap-2 md:flex-row md:items-center">
		<div>
			<h1 class="text-3xl font-bold md:text-3xl">Hello Jega</h1>
			<p class="text-base md:text-xl">What are you cooking today?</p>
		</div>

		<button class="cursor-pointer" on:click={navigateToprofile}>

			<img
			src="./avatar.png"
			alt="avatar"
			class="h-14 w-14 rounded-xl bg-orange-300 md:h-16 md:w-16"
			/>
		 </button>
	</div>

	<SearchBar
		enableNavigation={true}
		categories={categories.map((c) => c.strCategory ?? '')}
		on:openSearch={navigateToSearch}
		on:categorySelect={(e: CustomEvent<string>) => {
			const cat = e.detail;
			if (cat) {
				sessionStorage.setItem('fromHomepage', 'true');
				goto(`/searchpage?category=${encodeURIComponent(cat)}`);
			}
		}}
	/>

	<div class="mt-2 mb-2 flex gap-1 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden">
		<button
			class={`rounded-xl px-4 py-2 transition ${
				activeArea === 'All' ? 'bg-green-600 text-white' : 'bg-gray-200'
			}`}
			on:click={() => selectArea('All')}
		>
			All
		</button>

		{#each areas as area (area.strArea)}
			<button
				class={`rounded-xl px-4 py-2 transition ${
					activeArea === area.strArea ? 'bg-green-600 text-white' : 'bg-gray-200'
				}`}
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
		<div class="flex flex-col h-auto p-2">
			<p class="text-2xl font-bold">New Recipes</p>

			<div class="flex items-center h-42 md:h-50 gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
				{#each newRecipes as recipe (recipe.idMeal)}
					<div
						role="button"
						tabindex="0"
						class="relative flex w-65 md:w-70 shrink-0 cursor-pointer flex-col rounded-lg bg-gray-50 p-2 shadow transition hover:scale-105"
						on:click={() => openRecipe(recipe.idMeal)}
						on:keydown={(e: KeyboardEvent) =>
							e.key === 'Enter' && openRecipe(recipe.idMeal)}
					>
						<div class="p-2">
							<h1 class="truncate text-lg font-semibold">{recipe.strMeal}</h1>
							<img src="./Rating.png" alt="rating" class="h-5 w-25" />
						</div>

						<img
							src={recipe.strMealThumb}
							alt={recipe.strMeal}
							class="absolute -top-5 right-3 h-14 w-14 rounded-full object-cover md:h-15 md:w-15"
						/>

						<div class="flex gap-8 p-2">
							<img src="./Creator.png" alt="creator" />
							<img src="./Time.png" alt="time" />
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>