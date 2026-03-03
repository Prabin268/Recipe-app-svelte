<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { ArrowLeft } from 'lucide-svelte';
  import SearchBar from '$lib/components/SearchBar.svelte';
  import { searchMeals, getRandomMeals } from '$lib/api/meals';

  let query = '';
  let meals = [];
  let categories = [];

  let selectedCategory = 'All';
  let selectedTime = 'All';
  let selectedRate = null;

  let isSearching = false;

  async function resetSearch() {
    query = '';
    selectedCategory = 'All';
    selectedTime = 'All';
    selectedRate = null;
    isSearching = false;
    meals = await getRandomMeals();
  }

  async function runSearch() {
    const term =
      query.trim() ||
      (selectedCategory !== 'All' ? selectedCategory : '');

    if (!term) {
      await resetSearch();
      return;
    }

    isSearching = true;
    meals = await searchMeals(term);
  }

  function goBack() {
    goto('/homepage');
  }

  onMount(async () => {

    const res = await fetch(
      'https://www.themealdb.com/api/json/v1/1/list.php?c=list'
    );
    const data = await res.json();
    categories = data.meals.map(c => c.strCategory);

    const urlCategory = $page.url.searchParams.get('category');

    if (urlCategory) {
      selectedCategory = urlCategory;
      await runSearch();
    } else {
      await resetSearch();
    }
  });
</script>

<div class="flex h-full w-full flex-col p-4">

  <div class="flex items-center justify-between px-4 py-3 border-b">
    <button on:click={goBack}>
      <ArrowLeft />
    </button>
    <h1 class="text-2xl font-bold">Search recipes</h1>
    <div class="w-6"></div>
  </div>

  <SearchBar
    bind:query
    {categories}
    bind:selectedCategory
    bind:selectedTime
    bind:selectedRate
    onSearch={runSearch}
    onDebouncedSearch={runSearch}
  />

  <div class="mt-4 flex justify-between items-center">
    <h2 class="text-xl font-bold">
      {#if selectedCategory !== 'All'}
        {selectedCategory}
      {:else if !query}
        Recent Search
      {:else if query && meals.length === 0}
        No recipes found
      {:else}
        Search Results
      {/if}
    </h2>

    {#if isSearching}
      <span class="text-sm text-gray-500">
        {meals.length} results
      </span>
    {/if}
  </div>

  <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
    {#each meals as meal}
      <div
        class="relative h-40 rounded-xl bg-cover bg-center p-2 text-white"
        style="background-image:
          linear-gradient(to bottom, rgba(0,0,0,.1), rgba(0,0,0,.9)),
          url('{meal.strMealThumb}')"
      >
        <p class="absolute top-25 text-sm font-bold truncate">
          {meal.strMeal}
        </p>
        <p class="absolute bottom-5 text-sm">By Chef Jhon</p>
      </div>
    {/each}
  </div>
</div>