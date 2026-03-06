<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { addRecipe } from '$lib/db';
  import { getCategories, getAreas } from '$lib/api/meals';

  interface Category {
    strCategory: string;
  }

  interface Area {
    strArea?: string;
  }

  interface Ingredient {
    name: string;
    measure: string;
  }

  interface RecipeForm {
    id: number | null;
    name: string;
    category: string;
    area: string;
    mediaType: string;
    imageUrl: string;
    videoUrl: string;
    ingredients: Ingredient[];
    procedure: string;
  }

  let form: RecipeForm = {
    id: null,
    name: '',
    category: '',
    area: '',
    mediaType: 'image',
    imageUrl: '',
    videoUrl: '',
    ingredients: [{ name: '', measure: '' }],
    procedure: ''
  };

  let showCategoryDropdown: boolean = false;
  let showAreaDropdown: boolean = false;

  let categories: Category[] = [];
  let areas: Area[] = []; 

  onMount(async () => {
    categories = await getCategories();
    areas = await getAreas();
  });

  function selectCategory(cat: string) {
    form.category = cat;
    showCategoryDropdown = false;
  }

  function selectArea(area: string) {
    form.area = area;
    showAreaDropdown = false;
  }

function handleIngredientInput(value: string, index: number) {
    
    const regex = /^([\d\s\/.,]+)?\s*(.*)$/;
    const match = value.match(regex);
    if (match) {
      form.ingredients[index] = {
        measure: match[1]?.trim() || '',
        name: match[2]?.trim() || ''
      };
    }
  }

  function handleImageUpload(e: Event) {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => form.imageUrl = reader.result as string;
    reader.readAsDataURL(file);
  }

  function handleVideoUpload(e: Event) {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => form.videoUrl = reader.result as string;
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    if (!form.id) form.id = Date.now();
    
    const ingredientsString = form.ingredients
      .filter(i => i.name)
      .map(i => `${i.name} - ${i.measure}`)
      .join('\n');
    const recipeToSave = { ...form, ingredients: ingredientsString };
    await addRecipe(recipeToSave);
    goto('/profilepage');
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="flex flex-col w-full max-w-3xl mx-auto space-y-4 p-4 mt-6">
  <h1 class="font-bold text-2xl text-center mb-4">Customize Your Recipe</h1>

  <label class="flex flex-col">
    <span class="mb-1 font-medium">Name</span>
    <input type="text" bind:value={form.name} placeholder="Enter recipe name" required
      class="border-2 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
  </label>

  <div class="relative">
    <span class="block mb-1 font-medium">Category</span>
    <button type="button" class="w-full border-2 rounded-md px-3 py-2 text-left flex justify-between items-center"
      on:click={() => showCategoryDropdown = !showCategoryDropdown}>
      {form.category || 'Select Category'}
      <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    {#if showCategoryDropdown}
      <div class="absolute z-10 w-full mt-1 max-h-48 overflow-y-auto border rounded-md bg-white shadow-md">
        {#each categories as cat}
          <button type="button" class="block w-full px-3 py-2 text-left hover:bg-gray-100"
            on:click={() => selectCategory(cat.strCategory)}>
            {cat.strCategory}
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <div class="relative">
    <span class="block mb-1 font-medium">Area</span>
    <button type="button" class="w-full border-2 rounded-md px-3 py-2 text-left flex justify-between items-center"
      on:click={() => showAreaDropdown = !showAreaDropdown}>
      {form.area || 'Select Area'}
      <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    {#if showAreaDropdown}
      <div class="absolute z-10 w-full mt-1 max-h-48 overflow-y-auto border rounded-md bg-white shadow-md">
        {#each areas as area}
          <button type="button" class="block w-full px-3 py-2 text-left hover:bg-gray-100"
            on:click={() => selectArea(area.strArea ?? '')}>
            {area.strArea}
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <label class="flex flex-col">
    <span class="mb-1 font-medium">Upload Image</span>
    <input type="file" accept="image/*" on:change={handleImageUpload}
      class="text-sm rounded-md border-2 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400" />
    {#if form.imageUrl}
      <img src={form.imageUrl} alt="Preview" class="mt-2 w-full max-h-40 object-cover rounded-md" />
    {/if}
  </label>

  <label class="flex flex-col">
  <span class="mb-1 font-medium">Upload Video</span>
  <input
    type="file"
    accept="video/*"
    on:change={handleVideoUpload}
    class="text-sm rounded-md border-2 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
  {#if form.videoUrl}
    <video src={form.videoUrl} controls class="mt-2 w-full max-h-40 rounded-md">
      <track 
        src="/captions.vtt" 
        kind="captions" 
        srclang="en" 
        label="English captions" 
        default
      />
      Your browser does not support the video tag.
    </video>
  {/if}
</label>

  <label class="flex flex-col">
    <span class="mb-1 font-medium">Ingredients (auto-split measurement)</span>
    {#each form.ingredients as ingredient, i}
      <input
        type="text"
        placeholder="500g chicken"
        bind:value={ingredient.name}
        on:input={(e) => handleIngredientInput((e.target as HTMLInputElement).value, i)}
        class="mb-2 border-2 rounded-md px-3 py-2"
      />
    {/each}
  </label>

  <label class="flex flex-col">
    <span class="mb-1 font-medium">Procedure</span>
    <textarea bind:value={form.procedure} rows="4" placeholder="Enter procedure"
      class="border-2 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" required>
    </textarea>
  </label>

  <button type="submit"
    class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
    Save Recipe
  </button>
</form>