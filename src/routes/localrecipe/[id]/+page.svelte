<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { ArrowLeft, Ellipsis, Bookmark, Star } from 'lucide-svelte';
	import { getRecipeById, deleteRecipe } from '$lib/db';

	let recipe = null;
	let loading = true;
	let activeTab = 'ingredient';
	let showPopup = false;
	let showShareDialog = false;
	let showRateDialog = false;
	let rating = 0;

	$: recipeId = $page.params.id;

	onMount(async () => {
		recipe = await getRecipeById(Number(recipeId));
		loading = false;
	});

	$: localIngredients =
		recipe?.ingredients
			?.split('\n')
			.map((line) => {
				const [name, measure] = line.split('-').map((s) => s.trim());
				return { name, measure: measure || '' };
			})
			.filter((i) => i.name) || [];

	$: localSteps =
		recipe?.procedure
			?.split(/\r?\n/)
			.map((s) => s.trim())
			.filter(Boolean) || [];

	async function unsaveRecipe() {
		await deleteRecipe(recipe.id);
		goto('/profilepage');
	}

	function openPopup() {
		showPopup = true;
	}
	function closePopup() {
		showPopup = false;
	}
	function openShare() {
		showPopup = false;
		showShareDialog = true;
	}
	function openRate() {
		showPopup = false;
		showRateDialog = true;
	}
	function closeDialogs() {
		showPopup = false;
		showShareDialog = false;
		showRateDialog = false;
	}
	function setStep(index) {
		currentStep = index;
	}

	function navigateToreviewpage() {
		goto(`/reviewpage`);
	}
</script>

	{#if loading}
		<div class="flex h-screen items-center justify-center">
			<p class="text-lg text-gray-500">Loading recipe...</p>
		</div>
	{:else if recipe}
		<div class="flex items-center justify-between p-2">
			<button on:click={() => history.back()}>
				<ArrowLeft size="32" />
			</button>
			<button on:click={() => (showPopup = !showPopup)}>
				<Ellipsis size="32" />
			</button>
		</div>

		<div class="relative w-full">
			{#if activeTab === 'ingredient' && recipe.imageUrl}
				<img
					src={recipe.imageUrl}
					alt={recipe.name}
					class="h-60 w-full rounded-xl object-cover p-2"
				/>
				
				<div class="absolute right-3 bottom-3 flex gap-3">
					<img src="/Time.png" alt="time" class="h-10 w-20" />
					<button
						type="button"
						class="flex h-9 w-9 items-center justify-center rounded-full bg-white text-green-600"
						on:click={unsaveRecipe}
					>
						<Bookmark size={20} fill="currentColor" />
					</button>
				</div>
			{:else if activeTab === 'procedure' && recipe.videoUrl}
				<video src={recipe.videoUrl} controls class="h-60 w-full rounded-xl p-2">
					<track kind="captions" src="" srclang="en" label="English" />
				</video>
			{/if}
		</div>

		<div class="mt-2 w-full flex items-center justify-between px-3">
			<h1 class="text-2xl font-bold">{recipe.name}</h1>
			<p class="text-gray-400 ">(0 Reviews)</p>
		</div>

		<div class="mt-3 flex gap-2 px-3">
			<button
				class="flex-1 rounded-xl py-3 transition
				{activeTab === 'ingredient' ? 'bg-emerald-600 text-white' : 'bg-gray-200'}"
				on:click={() => (activeTab = 'ingredient')}
			>
				Ingredients
			</button>

			<button
				class="flex-1 rounded-xl py-3 transition
				{activeTab === 'procedure' ? 'bg-emerald-600 text-white' : 'bg-gray-200'}"
				on:click={() => (activeTab = 'procedure')}
			>
				Procedure
			</button>
		</div>


		{#if activeTab === 'ingredient'}
			<div class="mx-4 mt-4 space-y-3">
				{#each localIngredients as item}
					<div class="flex justify-between rounded-xl bg-gray-100 p-4">
						<h1>{item.name}</h1>
						<p class="text-gray-500">{item.measure}</p>
					</div>
				{/each}
			</div>
		{/if}


		{#if activeTab === 'procedure'}
			<div class="mx-4 mt-4 space-y-3">
				{#each localSteps as step, index}
					<div class="rounded-xl bg-gray-100 p-4">
						<strong>Step {index + 1}</strong>
						<p>{step}</p>
					</div>
				{/each}
			</div>
		{/if}

		{#if showPopup}
			<div class="absolute top-10 right-5 rounded-lg border-2 bg-white p-4 shadow-lg">
				<button class="flex items-center gap-2 p-2" on:click={openShare}>
					<img src="/icon4.png" alt="share-icon" class="h-4 w-4" />
					share
				</button>
				<button class="flex items-center gap-2 p-2" on:click={openRate}>
					<img src="/icon2.png" alt="rate-icon" class="h-4 w-4" />
					Rate Recipe
				</button>
				<button class="flex items-center gap-2 p-2" on:click={navigateToreviewpage}>
					<img src="/icon3.png" alt="review-icon" class="h-4 w-4" />
					Review
				</button>
				<button class="flex items-center gap-2 p-2" on:click={unsaveRecipe}>
					<img src="/icon1.png" alt="unsave-icon" class="h-4 w-4" />
					Unsave
				</button>
			</div>
		{/if}

		{#if showShareDialog}
			<div
				class="fixed top-1/2 left-1/2 w-90 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-4 shadow-lg"
			>
				<h2 class="mb-2 text-2xl font-bold">Recipe Link</h2>
				<p class="mb-4 text-gray-400">
					Copy recipe link to share your recipe link with friends and family.
				</p>
				<div class="flex">
					<input
						class="mb-2 w-full rounded-sm border p-3 text-[15px]"
						readonly
						value={window.location.href}
					/>
					<button
						class="h-12 w-30 rounded-sm bg-emerald-600 p-2 text-white"
						on:click={() => navigator.clipboard.writeText(window.location.href)}>Copy Link</button
					>
				</div>
			</div>
		{/if}

		{#if showRateDialog}
			<div
				class="fixed top-1/2 left-1/2 w-80 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-5 shadow-lg"
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
					class="mt-4 w-full rounded-lg py-2 {rating > 0
						? 'bg-amber-400 text-white'
						: 'bg-gray-200 text-gray-400'}"
					disabled={rating === 0}
					on:click={() => (showRateDialog = false)}
				>
					Send
				</button>
			</div>
		{/if}
	{/if}