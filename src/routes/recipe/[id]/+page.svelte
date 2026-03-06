<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { ArrowLeft, Ellipsis, Bookmark, Star } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { savedMeals } from '$lib/stores/savedMeals';
    import type { Meal } from '$lib/api/meals';

	interface IngredientItem {
		image: string;
		name: string;
		measure: string;
	}

	let meal: Meal | null = null;
	let loading: boolean = true;
	let activeTab: 'ingredient' | 'procedure' = 'ingredient';
	let currentStep: number = 0;

	let showPopup: boolean = false;
	let showShareDialog: boolean = false;
	let showRateDialog: boolean = false;

	let rating: number = 0;

	let mealId: string;
	$: mealId = $page.params.id;

	onMount(async () => {
		try {
			const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
			const data = await res.json();
			meal = data.meals?.[0] ?? null;
		} catch (err) {
			console.error(err);
		} finally {
			loading = false;
		}
	});

	let ingredients: IngredientItem[] = [];

	$: ingredients = meal
		? Array.from({ length: 20 }, (_, i) => i + 1)
				.map((i) => ({
					image: `https://www.themealdb.com/images/ingredients/${meal[`strIngredient${i}`]}-Small.png`,
					name: meal?.[`strIngredient${i}`],
					measure: meal?.[`strMeasure${i}`]
				}))
				.filter((i) => i.name && i.name.trim())
		: [];

	let steps: string[] = [];

	$: steps = meal?.strInstructions ? parseSteps(meal.strInstructions) : [];

	function parseSteps(text: string): string[] {
		if (!text) return [];

		const clean = text.replace(/\r/g, ' ').replace(/\n+/g, ' ').trim();
		const noNumbering = clean.replace(/Step\s*\d+[:.-]?\s*/gi, '');

		let sentences = noNumbering
			.split('.')
			.map((s) => s.trim())
			.filter(Boolean);
		sentences = sentences.filter((s) => !/^\d+\s/.test(s));
		sentences = sentences.map((s) => s + '.');
		return sentences;
	}

	function openPopup(): void {
		showPopup = true;
	}
	function closePopup(): void {
		showPopup = false;
	}
	function setStep(index: number): void {
		currentStep = index;
	}
	function openShare(): void {
		showPopup = false;
		showShareDialog = true;
	}
	function openRate(): void {
		showPopup = false;
		showRateDialog = true;
	}
	function closeDialogs(): void {
		showPopup = false;
		showShareDialog = false;
		showRateDialog = false;
	}
	function navigateToreviewpage(): void {
		goto(`/reviewpage`);
	}
	function unsaveMeal(): void {
		if (!meal) return;
		savedMeals.remove(meal.idMeal);
		showPopup = false;
	}
</script>

<div class="min-h-screen w-full bg-gray-50 p-2 sm:p-5">
	{#if loading}
		<div class="flex h-screen items-center justify-center">
			<p class="text-lg text-gray-500">Loading recipe...</p>
		</div>
	{:else if meal}
		
		<div class="relative w-full">
		
			<div class="flex items-center justify-between p-2">
				<button on:click={() => history.back()}>
					<ArrowLeft size="30" class="sm:size-10" />
				</button>
				<button on:click={openPopup}>
					<Ellipsis size="30" class="sm:size-10" />
				</button>
			</div>

			<div class="relative w-full">
				{#if activeTab === 'ingredient'}
					<img
						src={meal.strMealThumb}
						alt={meal.strMeal}
						class="h-60 w-full rounded-3xl object-cover sm:h-80"
					/>
					<img
						src="/Rating4.0.png"
						alt="rating"
						class="absolute top-4 right-4 h-6 w-16 sm:h-8 sm:w-20"
					/>
					<div class="absolute right-4 bottom-4 flex items-center gap-4">
						<img src="/Time.png" alt="time" class="h-6 w-12 sm:h-10 sm:w-20" />
						<button
							type="button"
							aria-label="remove-meal"
							class="flex h-8 w-8 items-center justify-center rounded-full bg-white text-green-600 sm:h-9 sm:w-9"
						>
							<Bookmark size={18} class="sm:size-20" fill="currentColor" />
						</button>
					</div>
				{:else}
					<iframe
						src={`https://www.youtube.com/embed/${meal.strYoutube.split('=')[1]}`}
						title={meal.strMeal}
						class="aspect-video h-60 w-full rounded-3xl sm:h-80"
						allowfullscreen
					></iframe>
				{/if}
			</div>

			<div class="mt-4 flex justify-between px-3">
				<h1 class="text-xl font-bold sm:text-2xl">{meal.strMeal}</h1>
				<p class="text-sm text-gray-400 sm:text-base">(0k Reviews)</p>
			</div>

			<div class="mt-3 flex items-center justify-between px-3">
				<div class="flex items-center gap-3">
					<img src="/profile2.png" alt="pic" class="h-10 w-10 rounded-full sm:h-15 sm:w-15" />
					<div class="flex flex-col justify-center">
						<h2 class="text-sm font-medium sm:text-base">Laura Wilson</h2>
						<img src="/Location.png" alt="location" class="h-3 sm:h-4" />
					</div>
				</div>
				<img src="/button2.png" alt="follow" class="h-8 sm:h-10" />
			</div>
		</div>

		<div class="mt-6 flex gap-2 px-3">
			<button
				class="flex-1 rounded-xl py-3"
				class:bg-emerald-600={activeTab === 'ingredient'}
				class:text-white={activeTab === 'ingredient'}
				on:click={() => (activeTab = 'ingredient')}
			>
				Ingredients
			</button>

			<button
				class="flex-1 rounded-xl py-3"
				class:bg-emerald-600={activeTab === 'procedure'}
				class:text-white={activeTab === 'procedure'}
				on:click={() => (activeTab = 'procedure')}
			>
				Procedure
			</button>
		</div>

		{#if activeTab === 'ingredient'}
			<div class="mx-3 mt-4 max-h-100 space-y-3 overflow-auto sm:max-h-125">
				{#each ingredients as item}
					<div class="flex justify-between rounded-xl bg-gray-100 p-4">
						<div class="flex h-10 w-10 items-center rounded-lg bg-white">
							<img src={item.image} alt={item.name} class="h-8 w-8" />
						</div>
						<div class="flex w-full justify-between">
							<h1>{item.name}</h1>
							<p class="text-gray-500">{item.measure}</p>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		{#if activeTab === 'procedure'}
			<div class="mx-3 mt-4 max-h-100 space-y-4 overflow-auto sm:max-h-125">
				{#each steps as step, index}
					<div class="w-full rounded-xl bg-gray-100 p-4">
						<strong>Step {index + 1}:</strong>
						<p class="mt-1">{step}</p>
					</div>
				{/each}
			</div>
		{/if}
	{/if}

	{#if showPopup}
		<button
			type="button"
			class="absolute inset-0 bg-black/40"
			aria-label="Close popup"
			on:click={closePopup}
		></button>
		<div class="absolute top-16 right-4 rounded-lg bg-white p-4 shadow-lg">
			<button class="flex items-center gap-2 p-2" on:click={openShare}>
				<img src="/icon4.png" alt="share-icon" class="h-4 w-4" /> share
			</button>
			<button class="flex items-center gap-2 p-2" on:click={openRate}>
				<img src="/icon2.png" alt="rate-icon" class="h-4 w-4" /> Rate Recipe
			</button>
			<button class="flex items-center gap-2 p-2" on:click={navigateToreviewpage}>
				<img src="/icon3.png" alt="review-icon" class="h-4 w-4" /> Review
			</button>
			<button class="flex items-center gap-2 p-2" on:click={unsaveMeal}>
				<img src="/icon1.png" alt="unsave-icon" class="h-4 w-4" /> Unsave
			</button>
		</div>
	{/if}

	{#if showShareDialog}
		<button
			class="fixed inset-0 bg-black/40"
			aria-label="Close share dialog"
			on:click={closeDialogs}
		></button>
		<div
			class="fixed top-1/2 left-1/2 w-80 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-4 shadow-lg sm:w-96"
		>
			<h2 class="mb-2 text-2xl font-bold">Recipe Link</h2>
			<p class="mb-4 text-gray-400">Copy recipe link and share with friends and family.</p>
			<input
				class="mb-2 w-full rounded-lg border p-3 text-sm"
				readonly
				value={window.location.href}
			/>
			<button
				class="mt-2 w-full rounded-lg bg-emerald-600 p-2 text-white"
				on:click={() => navigator.clipboard.writeText(window.location.href)}>Copy Link</button
			>
		</div>
	{/if}

	{#if showRateDialog}
		<button class="fixed inset-0 bg-black/40" aria-label="Close rate dialog" on:click={closeDialogs}
		></button>
		<div
			class="fixed top-1/2 left-1/2 w-72 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-5 shadow-lg sm:w-80"
		>
			<h2 class="mb-3 text-lg font-bold">Rate Recipe</h2>
			<div class="flex justify-center gap-2 text-2xl">
				{#each [1, 2, 3, 4, 5] as star}
					<button type="button" class="text-amber-300" on:click={() => (rating = star)}>
						<Star
							class={rating >= star ? 'fill-amber-400 text-amber-400' : 'text-amber-300'}
							strokeWidth={1}
						/>
					</button>
				{/each}
			</div>
			<button
				class="mt-4 w-full rounded-lg py-2"
				class:bg-amber-400={rating > 0}
				class:text-white={rating > 0}
				class:bg-gray-200={rating === 0}
				class:text-gray-400={rating === 0}
				disabled={rating === 0}
				on:click={() => (showRateDialog = false)}>Send</button
			>
		</div>
	{/if}
</div>
