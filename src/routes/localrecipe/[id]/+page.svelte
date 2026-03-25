<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { ArrowLeft, Ellipsis, Bookmark, Star, Timer } from 'lucide-svelte';
	import { getRecipeById, deleteRecipe } from '$lib/db/db';
	import { fly } from 'svelte/transition';

	interface Ingredient {
		name: string;
		measure: string;
	}

	interface Recipe {
		id: number;
		name: string;
		imageUrl?: string;
		videoUrl?: string;
		ingredients?: Ingredient[] | string[];
		procedure?: string;
	}

	let isfollowing: boolean = false;
	let recipe: Recipe | null = null;
	let loading = true;

	let activeTab: 'ingredient' | 'procedure' = 'ingredient';

	let showPopup = false;
	let showShareDialog = false;
	let showRateDialog = false;

	let rating = 0;

	$: recipeId = $page.params.id;

	onMount(async () => {
		recipe = await getRecipeById(Number(recipeId));
		loading = false;
	});

	let localIngredients: Ingredient[] = [];

	$: {
		if (recipe?.ingredients) {
			let arr = Array.isArray(recipe.ingredients) ? recipe.ingredients : [recipe.ingredients];

			localIngredients = arr
				.flatMap((item) => item.split(',')) 
				.map((i) => {
					const [name, measure] = i.split('-').map((s) => s.trim());
					return { name: name || i.trim(), measure: measure || '' };
				})
				.filter((i) => i.name);
		} else {
			localIngredients = [];
		}
	}

	let localSteps: string[] = [];
	$: {
		if (typeof recipe?.procedure === 'string') {
			localSteps = recipe.procedure
				.split(/\r?\n/)
				.map((s) => s.trim())
				.filter(Boolean);
		} else {
			localSteps = [];
		}
	}

	async function unsaveRecipe() {
		if (!recipe) return;
		await deleteRecipe(recipe.id);
		goto('/profile');
	}

	function openPopup(): void {
		showPopup = true;
	}
	function closePopup(): void {
		showPopup = false;
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

	function navigateToreview(): void {
		goto(`/review`);
	}

	function toggleFollow () {
		isfollowing = !isfollowing;
	}
</script>

<div class="min-h-screen mb-10">



{#if loading}
	<div class="flex h-screen items-center justify-center">
		<p class="text-lg text-gray-500">Loading recipe...</p>
	</div>
{:else if recipe}
	<div class="flex items-center justify-between p-2">
		<button type="button" class="cursor-pointer" on:click={() => history.back()}>
			<ArrowLeft size="32" />
		</button>
		<button type="button" class="cursor-pointer" on:click={openPopup}>
			<Ellipsis size="32" />
		</button>
	</div>

	<div class="relative w-full">
		{#if recipe.imageUrl && recipe.videoUrl}
			{#if activeTab === 'ingredient'}

			<div class="w-full p-2">

				<div
						class="relative w-full h-55 rounded-2xl inset-0 bg-cover bg-center md:h-80 md:mr-3"
						style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.9)),url({recipe.imageUrl})"
					>
				<div class="flex justify-center items-center gap-2 absolute top-2 right-2 rounded-xl md:w-20 md:h-8 w-15  bg-orange-200">
					<Star fill="orange" color="orange" size="15"/><h1>
						4.0
					</h1>
				</div>
				
				<div class="absolute right-3 bottom-3 flex gap-3">
					
					<div class="flex justify-center gap-1 items-center text-white h-10 w-22">
						<Timer /> <h1>20 mins</h1>
					</div>
					
					<button
						type="button"
						class="flex h-9 w-9 items-center justify-center rounded-full bg-white text-green-600 cursor-pointer"
						on:click={unsaveRecipe}
					>
						<Bookmark size={20} />
					</button>
				</div>	
			</div>
		</div>

					
			{:else}
				<video src={recipe.videoUrl} controls class="h-60 w-full rounded-2xl p-2 md:h-80">
					<track kind="captions" label="English captions" src="" default />
				</video>
			{/if}
		{:else if recipe.imageUrl}
			<img
				src={recipe.imageUrl}
				alt={recipe.name}
				class="h-60 w-full rounded-xl object-cover p-2"
			/>
		{:else if recipe.videoUrl}
			<video src={recipe.videoUrl} controls class="h-60 w-full rounded-xl p-2">
				<track kind="captions" label="English captions" src="" default />
			</video>
		{/if}
	</div>

	<div class="mt-2 flex w-full items-center justify-between px-3">
		<h1 class="text-2xl font-bold">{recipe.name}</h1>
		<p class="text-gray-400">(0 Reviews)</p>
	</div>

	<div class="mt-3 flex items-center justify-between px-3">
				<div class="flex items-center gap-3">
					<img src="/profile2.png" alt="pic" class="h-10 w-10 rounded-full sm:h-15 sm:w-15" />
					<div class="flex flex-col justify-center">
						<h2 class="text-sm font-medium sm:text-base">Laura Wilson</h2>
						<img src="/Location.png" alt="location" class="h-3 sm:h-4" />
					</div>
				</div>
				<button on:click={toggleFollow} class="bg-emerald-600 rounded-lg text-white text-sm w-15 h-8 md:h-8 md:w-15 sm:h-8 transition-colors cursor-pointer duration-200 {isfollowing ? 'bg-emerald-500 hover:bg-emrald-600' : 'bg-green-600 hover:bg-green-700'}">{isfollowing ? 'Unfollow' : 'Follow'}</button>
			</div>

	<div class="mt-3 flex gap-2 px-3">
		<button
			type="button"
			class="flex-1 rounded-xl py-3 transition cursor-pointer {activeTab === 'ingredient'
				? 'bg-emerald-600 text-white'
				: 'bg-gray-200'}"
			on:click={() => (activeTab = 'ingredient')}
		>
			Ingredients
		</button>
		<button
			type="button"
			class="flex-1 rounded-xl py-3 transition cursor-pointer {activeTab === 'procedure'
				? 'bg-emerald-600 text-white'
				: 'bg-gray-200'}"
			on:click={() => (activeTab = 'procedure')}
		>
			Procedure
		</button>
	</div>

	{#if activeTab === 'ingredient'}
		<div
		in:fly={{ x: -200, duration: 350 }}
		out:fly={{ x: -200, duration: 350 }} class="mx-4 mt-4 space-y-3">
			{#each localIngredients as item}
				<div class="flex justify-between rounded-xl bg-gray-100 p-4">
					<h1>{item.name}</h1>
					<p class="text-gray-500">{item.measure}</p>
				</div>
			{/each}
		</div>
	{/if}

	{#if activeTab === 'procedure'}
		<div
		in:fly={{ x: 200, duration: 350 }}
		out:fly={{ x: 200, duration: 350 }}
		 class="mx-4 mt-4 space-y-3">
			{#each localSteps as step, index}
				<div class="rounded-xl bg-gray-100 p-4">
					<strong>Step {index + 1}</strong>
					<p>{step}</p>
				</div>
			{/each}
		</div>
	{/if}

	{#if showPopup}
		<button
			type="button"
			class="fixed inset-0 bg-black/40"
			aria-label="Close popup"
			on:click={closePopup}
		></button>
		<div class="absolute top-10 right-5 rounded-lg border-2 bg-white p-4 shadow-lg" role="menu">
			<button type="button" class="flex items-center gap-2 p-2 cursor-pointer" on:click={openShare}>
				<img src="/icon4.png" alt="share-icon" class="h-4 w-4" />
				share
			</button>
			<button type="button" class="flex items-center gap-2 p-2 cursor-pointer" on:click={openRate}>
				<img src="/icon2.png" alt="rate-icon" class="h-4 w-4" />
				Rate Recipe
			</button>
			<button type="button" class="flex items-center gap-2 p-2 cursor-pointer" on:click={navigateToreview}>
				<img src="/icon3.png" alt="review-icon" class="h-4 w-4" />
				Review
			</button>
			<button type="button" class="flex items-center gap-2 p-2 cursor-pointer" on:click={unsaveRecipe}>
				<img src="/icon1.png" alt="unsave-icon" class="h-4 w-4" />
				Remove
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
					type="button"
					class="h-12 w-30 rounded-sm bg-emerald-600 p-2 text-white cursor-pointer"
					on:click={() => navigator.clipboard.writeText(window.location.href)}>Copy Link</button
				>
			</div>
		</div>
	{/if}

	{#if showRateDialog}
		<button
			class="fixed inset-0 bg-black/40"
			aria-label="Close share dialog"
			on:click={closeDialogs}
		></button>
		<div
			class="fixed top-1/2 left-1/2 w-80 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-5 shadow-lg"
		>
			<h2 class="mb-3 text-lg font-bold">Rate Recipe</h2>
			<div class="flex justify-center gap-2 text-2xl">
				{#each [1, 2, 3, 4, 5] as star}
					<button type="button" class="text-amber-300 cursor-pointer" on:click={() => (rating = star)}>
						<Star
							class={rating >= star ? 'fill-amber-400 text-amber-400' : 'text-amber-300'}
							strokeWidth={1}
						/>
					</button>
				{/each}
			</div>
			<button
				class="mt-4 w-full rounded-lg py-2 cursor-pointer {rating > 0
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

</div>