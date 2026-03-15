<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import * as Drawer from '$lib/components/ui/drawer';
  import { Settings2, Star, Search } from 'lucide-svelte';

  export let query: string = '';
  export let categories: string[] = [];
  export let selectedCategory: string = 'All';
  export let selectedTime: string = 'All';
  export let selectedRate: number | null = null;

  export let enableNavigation: boolean = false;
  export let onSearch: () => void = () => {};
  export let onDebouncedSearch: () => void = () => {};
  export let onApplyFilter: () => void = () => {};

  const dispatch = createEventDispatcher<{
    openSearch: void;
    timeSelect: string;
    rateSelect: number;
    categorySelect: string;
  }>();

  let open: boolean = false;
  let debounceTimer: number;

  function handleInput() {
    clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(() => {
      onDebouncedSearch();
    }, 400);
  }

  function selectTime(time: string) {
    selectedTime = time;
    dispatch('timeSelect', time);
  }

  function selectRate(rate: number) {
    selectedRate = rate;
    dispatch('rateSelect', rate);
  }

  function selectCategory(cat: string) {
    selectedCategory = cat;
    dispatch('categorySelect', cat);
  }

  function applyFilter() {
    onApplyFilter();   
    open = false;
  }
</script>

<div class="flex w-full items-center gap-2 pt-2">

  <div class="flex flex-1 items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-sm">
    <Search size={18} class="text-gray-400" />
    <input
      type="text"
      placeholder="Search recipe"
      class="w-full text-base outline-none"
      bind:value={query}
      on:input={handleInput}
      on:keydown={(e: KeyboardEvent) => e.key === 'Enter' && onSearch()}
      on:click={() => enableNavigation && dispatch('openSearch')}
    />
  </div>

  
  <Drawer.Root bind:open={open} class="" portalProps={{}}>
    <Drawer.Trigger>
      <div class="flex justify-center rounded-xl bg-emerald-600 p-3 w-13 h-12 md:w-15 text-white cursor-pointer">
        <Settings2 />
      </div>
    </Drawer.Trigger>

    <Drawer.Content class="" portalProps={{}}>
      <Drawer.Header class="">
        <Drawer.Title class="text-center text-lg font-semibold">
          Filter Search
        </Drawer.Title>

       
        <div class="mt-4">
          <h2 class="font-bold">Time</h2>
          <div class="flex flex-wrap gap-2">
            {#each ['All', 'Newest', 'Oldest', 'Popularity'] as time}
              <button
                type="button"
                on:click={() => selectTime(time)}
                class={`rounded-xl border px-4 py-2 text-sm cursor-pointer ${
                  selectedTime === time
                    ? 'bg-emerald-600 text-white'
                    : 'border-emerald-600 text-emerald-600'
                }`}
              >
                {time}
              </button>
            {/each}
          </div>
        </div>

        <div class="mt-4">
          <h2 class="font-bold">Rate</h2>
          <div class="flex flex-wrap gap-2">
            {#each [5,4,3,2,1] as rate}
              <button
                type="button"
                on:click={() => selectRate(rate)}
                class={`flex items-center gap-1 rounded-xl border px-4 py-2 text-sm cursor-pointer ${
                  selectedRate === rate
                    ? 'bg-emerald-600 text-white'
                    : 'border-emerald-600 text-emerald-600'
                }`}
              >
                {rate} <Star size={16}/>
              </button>
            {/each}
          </div>
        </div>

      
        <div class="mt-4">
          <h2 class="font-bold">Category</h2>
          <div class="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              on:click={() => selectCategory('All')}
              class={`rounded-xl border px-4 py-2 text-sm cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-emerald-600 text-white'
                  : 'border-emerald-600 text-emerald-600'
              }`}
            >
              All
            </button>

            {#each categories as cat}
              <button
                type="button"
                on:click={() => selectCategory(cat)}
                class={`rounded-xl border px-4 py-2 text-sm cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'border-emerald-600 text-emerald-600'
                }`}
              >
                {cat}
              </button>
            {/each}
          </div>
        </div>
      </Drawer.Header>

      <Drawer.Footer class="">
        <button
          type="button"
          on:click={applyFilter}
          class="h-12 w-full bg-emerald-600 text-white rounded-xl cursor-pointer"
        >
          Apply Filter
        </button>
      </Drawer.Footer>
    </Drawer.Content>
  </Drawer.Root>
</div>