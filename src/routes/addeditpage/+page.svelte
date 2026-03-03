<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { addRecipe } from '$lib/db';
  import { getCategories } from '$lib/api/meals';

  let form = {
    id: null,
    name: '',
    category: '',
    mediaType: 'image',
    imageUrl: '',
    videoUrl: '',
    ingredients: '',
    procedure: ''
  };

  let showDropdown = false;
  let categories = [];

  onMount(async () => {
    categories = await getCategories();
  });

  function selectCategory(cat) {
    form.category = cat;
    showDropdown = false;
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => (form.imageUrl = reader.result);
    reader.readAsDataURL(file);
  }

  function handleVideoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => (form.videoUrl = reader.result);
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    if (!form.id) form.id = Date.now();
    await addRecipe(form);
    goto('/profilepage');
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="flex flex-col w-full max-w-xl mx-auto space-y-4 p-4 mt-6">
  <h1 class="font-bold text-2xl text-center mb-4">Customize Your Recipe</h1>

  <label class="flex flex-col">
    <span class="mb-1 font-medium">Name</span>
    <input
      type="text"
      bind:value={form.name}
      class="border-2 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      placeholder="Enter recipe name"
      required
    />
  </label>

  <div class="relative">
    <span class="block mb-1 font-medium">Category</span>
    <button
      type="button"
      class="w-full border-2 rounded-md px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-400 flex justify-between items-center"
      on:click={() => (showDropdown = !showDropdown)}
    >
      {form.category || 'Select Category'}
      <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    {#if showDropdown}
      <div class="absolute z-10 w-full mt-1 max-h-48 overflow-y-auto border rounded-md bg-white shadow-md">
        {#each categories as cat}
          <button
            type="button"
            class="block w-full px-3 py-2 text-left hover:bg-gray-100"
            on:click={() => selectCategory(cat.strCategory)}
          >
            {cat.strCategory}
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Image Upload -->
  <label class="flex flex-col">
    <span class="mb-1 font-medium">Upload Image</span>
    <input
      type="file"
      accept="image/*"
      on:change={handleImageUpload}
      class="text-sm rounded-md border-2 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    {#if form.imageUrl}
      <img src={form.imageUrl} alt="Preview" class="mt-2 w-full max-h-40 object-cover rounded-md" />
    {/if}
  </label>

  <!-- Video Upload -->
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
	  </video>
    {/if}
  </label>

  <!-- Ingredients -->
  <label class="flex flex-col">
    <span class="mb-1 font-medium">Ingredients</span>
    <textarea
      bind:value={form.ingredients}
      rows="4"
      placeholder="Enter the required ingredients"
      class="border-2 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
      required
    ></textarea>
  </label>

  <!-- Procedure -->
  <label class="flex flex-col">
    <span class="mb-1 font-medium">Procedure</span>
    <textarea
      bind:value={form.procedure}
      rows="4"
      placeholder="Enter the required procedure"
      class="border-2 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
      required
    ></textarea>
  </label>

  <!-- Submit Button -->
  <button
    type="submit"
    class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
  >
    Save Recipe
  </button>
</form>