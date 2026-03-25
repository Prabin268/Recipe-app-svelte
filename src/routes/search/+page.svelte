<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { ArrowLeft } from 'lucide-svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import SearchSkeleton from '$lib/components/SearchSkeleton.svelte';
	import { searchMeals, getRandomMeals } from '$lib/api/meals';
	import type { Meal } from '$lib/api/meals';

	interface SavedMeal {
		id: string;
		name: string;
		image: string;
	}

	let isLoading: boolean = true;
	let query: string = '';
	let meals: Meal[] = [];
	let categories: string[] = [];

	let selectedCategory: string = 'All';
	let selectedTime: string = 'All';
	let selectedRate: number | null = null;

	let isSearching: boolean = false;

	async function resetSearch(): Promise<void> {
		isLoading = true;

		query = '';
		selectedCategory = 'All';
		selectedTime = 'All';
		selectedRate = null;
		isSearching = false;

		meals = await getRandomMeals();

		if (localStorage.getItem('reloaded') === 'true') {
			history.replaceState({}, '', '/search');
			localStorage.removeItem('reloaded');
		}

		isLoading = false;
	}
	
	async function runSearch(category?: string): Promise<void> {
		isLoading = true;

		if (category) selectedCategory = category;

		isSearching = !!query || selectedCategory !== 'All';

		let results: Meal[] = [];

		if (query.trim()) {
			results = await searchMeals(query.trim());
		} else {
			results = await getRandomMeals();
		}

		if (selectedCategory !== 'All') {
			results = results.filter((meal) => meal.strCategory === selectedCategory);
		}

		meals = results;

		if (selectedCategory !== 'All') {
			history.replaceState({}, '', `/search?category=${encodeURIComponent(selectedCategory)}`);
		}

		isLoading = false;
	}

	onMount(async () => {
		isLoading = true;

		const res: Response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
		const data: { meals: { strCategory: string }[] } = await res.json();
		categories = data.meals.map((c) => c.strCategory);

		const urlCategory: string | null = $page.url.searchParams.get('category');
		const fromHome = localStorage.getItem('fromHome');
		if (urlCategory && fromHome) {
			selectedCategory = urlCategory;
			await runSearch(urlCategory);

			localStorage.removeItem('fromHome');
		} else {
			await resetSearch();

			history.replaceState({}, '', '/search');
		}

		isLoading = false;
	});

	function openRecipe(id: string): void {
		goto(`/recipe/${id}`);
	}

	function goBack(): void {
		goto('/home');
	}
</script>

<div class="flex flex-col p-4 min-h-screen">
	<div class="flex items-center justify-between py-3">
		<button on:click={goBack}>
			<ArrowLeft />
		</button>
		<h1 class="flex-1 text-center text-2xl font-bold">Search recipes</h1>
	</div>

	<SearchBar
		bind:query
		{categories}
		bind:selectedCategory
		bind:selectedTime
		bind:selectedRate
		onSearch={() => runSearch()}
		onDebouncedSearch={() => runSearch()}
		onApplyFilter={() => runSearch(selectedCategory)}
	/>

	<div class="mt-4 flex items-center justify-between">
		<h2 class="text-xl font-bold">
			{#if query && meals.length === 0}
				No recipes found
			{:else if query}
				Search Results
			{:else if selectedCategory !== 'All'}
				{selectedCategory}
			{:else}
				Recent Search
			{/if}
		</h2>

		{#if isSearching}
			<span class="text-sm text-gray-500">
				{meals.length} results
			</span>
		{/if}
	</div>

	{#if isLoading}
		<div class="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
			{#each Array(6) as _}
				<SearchSkeleton />
			{/each}
		</div>
	{:else}
		<div class="grid w-full grid-cols-2 gap-3 md:grid-cols-3">
			{#each meals as meal (meal.idMeal)}
				<div
					role="button"
					tabindex="0"
					class="relative h-40 w-full cursor-pointer overflow-hidden rounded-lg shadow md:h-48"
					on:click={() => goto(`/recipe/${meal.idMeal}`)}
					on:keydown={(e: KeyboardEvent) => e.key === 'Enter' && goto(`/recipe/${meal.idMeal}`)}
				>
					<div
						class="absolute inset-0 bg-cover bg-center"
						style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,1)),url({meal.strMealThumb})"
					></div>

					<div class="absolute right-3 bottom-10 left-3 z-10 text-white">
						<h2 class="truncate text-lg font-bold">
							{meal.strMeal}
						</h2>
					</div>

					<div class="absolute right-3 bottom-3 left-3 z-10 flex items-center justify-between">
						<p class="text-sm font-semibold text-white">By Chef John</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>