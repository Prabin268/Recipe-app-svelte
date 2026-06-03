<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { ArrowLeft, Ellipsis, Bookmark, Star, Timer } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { savedMeals } from '$lib/stores/savedMeals';
	import type { Meal } from '$lib/api/meals';
	import profile2 from '$lib/assets/profile2.png';
	import Location from '$lib/assets/Location.png';
	import icon1 from '$lib/assets/icon1.png';
	import icon2 from '$lib/assets/icon2.png';
	import icon3 from '$lib/assets/icon3.png';
	import icon4 from '$lib/assets/icon4.png';

	let meal: Meal | null = null;
	let loading = true;
	let activeTab: 'ingredient' | 'procedure' = 'ingredient';

	let isFollowing = false;
	let isSaved = false;

	let showPopup = false;
	let showShareDialog = false;
	let showRateDialog = false;
	let rating = 0;

	onMount(async () => {
		const mealId = $page.params.id;
		if (!mealId) {
			loading = false;
			return;
		}

		try {
			const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
			const data = await res.json();
			meal = data.meals?.[0] ?? null;

			if (meal) {
				isSaved = $savedMeals.some((m) => m.id === meal!.idMeal);
			}
		} catch (err) {
			console.error('Failed to fetch meal:', err);
		} finally {
			loading = false;
		}
	});

	 function goBack() {
    if (window.history.length > 1) {
      history.back();
    } else {
      goto('/');
    }
  }

	function getIngredients() {
		if (!meal) return [];

		const list = [];
		for (let i = 1; i <= 20; i++) {
			const name = meal[`strIngredient${i}`] ?? '';
			const measure = meal[`strMeasure${i}`] ?? '';
			if (name.trim()) {
				list.push({
					name,
					measure,
					image: `https://www.themealdb.com/images/ingredients/${name}-Small.png`
				});
			}
		}
		return list;
	}

	function getSteps() {
		if (!meal?.strInstructions) return [];

		const text = meal.strInstructions
			.replace(/\r/g, ' ')
			.replace(/\n+/g, ' ')
			.replace(/Step\s*\d+[:.-]?\s*/gi, '')
			.trim();

		return text
			.split('.')
			.map((s) => s.trim())
			.filter((s) => s && !/^\d+\s/.test(s))
			.map((s) => s + '.');
	}

	function toggleSave() {
		if (!meal) return;
		savedMeals.toggle(meal);
		isSaved = !isSaved;
	}

	function unsave() {
		if (!meal) return;
		savedMeals.remove(meal.idMeal);
		isSaved = false;
		showPopup = false;
	}

	function toggleFollow() {
		isFollowing = !isFollowing;
	}

	function copyLink() {
		navigator.clipboard.writeText(window.location.href);
	}
</script>

<div class="relative min-h-dvh w-full bg-gray-50 p-2 sm:p-10">
	{#if loading}
		<div class="flex h-screen items-center justify-center">
			<p class="text-gray-500">Loading recipe...</p>
		</div>
	{:else if meal}
		<div class="flex items-center justify-between p-2">
			<button on:click={goBack} >
				<ArrowLeft size={28} class="cursor-pointer" />
			</button>
			<button on:click={() => (showPopup = true)}>
				<Ellipsis size={28} class="cursor-pointer" />
			</button>
		</div>

		{#if activeTab === 'ingredient'}
			<div
				class="relative h-52 w-full rounded-3xl bg-cover bg-center md:h-102"
				style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.9)), url({meal.strMealThumb});
				background-size: min(100%, 1200px) min(100%, 500px);
                background-repeat: no-repeat;"
			>
				<div
					class="absolute top-4 right-3 flex items-center gap-1 rounded-xl bg-orange-200 px-2 py-1"
				>
					<Star fill="orange" color="orange" size={14} />
					<span class="text-sm">4.0</span>
				</div>

				<div class="absolute right-4 bottom-4 flex items-center gap-3">
					<div class="flex items-center gap-1 text-sm text-white">
						<Timer size={16} />
						<span>20 mins</span>
					</div>
					<button
						aria-label="Save meal"
						class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white {isSaved
							? 'text-green-600'
							: 'text-gray-300'}"
						on:click={toggleSave}
					>
						<Bookmark size={18} />
					</button>
				</div>
			</div>
		{:else}
			<iframe
				src={`https://www.youtube.com/embed/${meal.strYoutube?.split('=')[1] ?? ''}`}
				title={meal.strMeal}
				class="aspect-video h-60 w-full rounded-3xl sm:h-102"
				allowfullscreen
			></iframe>
		{/if}

		<div class="mt-4 flex items-center justify-between px-3">
			<h1 class="text-xl font-bold">{meal.strMeal}</h1>
			<p class="text-sm text-gray-400">(0 Reviews)</p>
		</div>

		<div class="mt-3 flex items-center justify-between px-3">
			<div class="flex items-center gap-3">
				<img src={profile2} alt="Author" class="h-10 w-10 rounded-full" />
				<div>
					<p class="text-sm font-medium">Laura Wilson</p>
					<img src={Location} alt="Location" class="h-3" />
				</div>
			</div>
			<button
				on:click={toggleFollow}
				class="cursor-pointer rounded-lg px-3 py-1 text-sm text-white {isFollowing
					? 'bg-emerald-500'
					: 'bg-green-600'}"
			>
				{isFollowing ? 'Unfollow' : 'Follow'}
			</button>
		</div>

		<div class="mt-6 flex gap-2 px-3">
			<button
				class="flex-1 cursor-pointer rounded-xl py-3 {activeTab === 'ingredient'
					? 'bg-emerald-600 text-white'
					: ''}"
				on:click={() => (activeTab = 'ingredient')}
			>
				Ingredients
			</button>
			<button
				class="flex-1 cursor-pointer rounded-xl py-3 {activeTab === 'procedure'
					? 'bg-emerald-600 text-white'
					: ''}"
				on:click={() => (activeTab = 'procedure')}
			>
				Procedure
			</button>
		</div>

		{#if activeTab === 'ingredient'}
			<div class="mx-3 mt-4 max-h-96 space-y-3 overflow-auto">
				{#each getIngredients() as item}
					<div class="flex items-center gap-3 rounded-xl bg-gray-100 p-4">
						<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
							<img src={item.image} alt={item.name} class="h-8 w-8" />
						</div>
						<p class="flex-1">{item.name}</p>
						<p class="text-sm text-gray-500">{item.measure}</p>
					</div>
				{/each}
			</div>
		{/if}

		{#if activeTab === 'procedure'}
			<div class="mx-3 mt-4 max-h-96 space-y-4 overflow-auto">
				{#each getSteps() as step, index}
					<div class="rounded-xl bg-gray-100 p-4">
						<p class="mb-1 font-semibold">Step {index + 1}</p>
						<p>{step}</p>
					</div>
				{/each}
			</div>
		{/if}
	{/if}

	{#if showPopup}
		<button
			class="absolute inset-0 z-40 bg-black/40"
			on:click={() => (showPopup = false)}
			aria-label="Close"
		></button>

		<div class="absolute top-16 right-4 z-50 space-y-1 rounded-lg bg-white p-4 shadow-lg">
			<button
				class="flex w-full cursor-pointer items-center gap-2 p-2"
				on:click={() => {
					showPopup = false;
					showShareDialog = true;
				}}
			>
				<img src={icon4} alt="" class="h-4 w-4" /> Share
			</button>
			<button
				class="flex w-full cursor-pointer items-center gap-2 p-2"
				on:click={() => {
					showPopup = false;
					showRateDialog = true;
				}}
			>
				<img src={icon2} alt="" class="h-4 w-4" /> Rate Recipe
			</button>
			<button
				class="flex w-full cursor-pointer items-center gap-2 p-2"
				on:click={() => goto('/review')}
			>
				<img src={icon3} alt="" class="h-4 w-4" /> Review
			</button>
			<button class="flex w-full cursor-pointer items-center gap-2 p-2" on:click={unsave}>
				<img src={icon1} alt="" class="h-4 w-4" /> Unsave
			</button>
		</div>
	{/if}

	{#if showShareDialog}
		<button
			class="fixed inset-0 bg-black/40"
			on:click={() => (showShareDialog = false)}
			aria-label="Close"
		></button>
		<div
			class="fixed top-1/2 left-1/2 w-80 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-5 shadow-lg"
		>
			<h2 class="mb-1 text-xl font-bold">Recipe Link</h2>
			<p class="mb-4 text-sm text-gray-400">Share this recipe with friends and family.</p>
			<div class="flex gap-2">
				<input class="flex-1 rounded border p-2 text-sm" readonly value={window.location.href} />
				<button
					class="cursor-pointer rounded bg-emerald-600 px-3 text-sm text-white"
					on:click={copyLink}
				>
					Copy
				</button>
			</div>
		</div>
	{/if}

	{#if showRateDialog}
		<button
			class="fixed inset-0 bg-black/40"
			on:click={() => (showRateDialog = false)}
			aria-label="Close"
		></button>
		<div
			class="fixed top-1/2 left-1/2 w-72 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-5 shadow-lg"
		>
			<h2 class="mb-4 text-lg font-bold">Rate Recipe</h2>

			<div class="flex justify-center gap-2">
				{#each [1, 2, 3, 4, 5] as star}
					<button class="cursor-pointer" on:click={() => (rating = star)}>
						<Star
							size={28}
							strokeWidth={1}
							class={rating >= star ? 'fill-amber-400 text-amber-400' : 'text-amber-300'}
						/>
					</button>
				{/each}
			</div>

			<button
				class="mt-4 w-full cursor-pointer rounded-lg py-2 {rating > 0
					? 'bg-amber-400 text-white'
					: 'bg-gray-200 text-gray-400'}"
				disabled={rating === 0}
				on:click={() => (showRateDialog = false)}
			>
				Send
			</button>
		</div>
	{/if}
</div>