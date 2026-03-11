<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { House, Bookmark, Bell, User, Plus, ChevronLeft, ChevronRight } from 'lucide-svelte';
  import type { ComponentType } from 'svelte';

  type Route = 
     | '/homepage'
     | '/savedpage'
     | '/notificationpage'
     | '/profilepage'
     | '/addeditpage';

     interface NavItem {
      icon: ComponentType;
      label: string;
      route: Route;
     }

  const items: NavItem[] = [
    { icon: House, label: 'Home', route: '/homepage' },
    { icon: Bookmark, label: 'Saved', route: '/savedpage' },
    { icon: Bell, label: 'Notifications', route: '/notificationpage' },
    { icon: User, label: 'Profile', route: '/profilepage' },
    { icon: Plus, label: 'Edit', route: '/addeditpage' }
  ];

  let collapsed = false;
</script>

<aside class="hidden sticky top-0 max-h-screen bg-white border-r
  transition-all duration-300 md:flex flex-col
  {collapsed ? 'w-16' : 'w-56'}">

  <div class="flex justify-end p-3">
  {#if !collapsed}
  <div class="w-full">

    <h1 class="text-lg text-left font-semibold text-gray-800 whitespace-nowrap">Recipe App</h1>
  </div>
    {/if}

    <button
      on:click={() => (collapsed = !collapsed)}
      class="p-2 rounded-md hover:bg-gray-100"
    >
      {#if collapsed}
        <ChevronRight size={22} />
      {:else}
        <ChevronLeft size={22} />
      {/if}
    </button>
  </div>

  <nav class="flex flex-col gap-3 px-2">
    {#each items as item}
      <button
        on:click={() => goto(item.route)}
        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm
               transition
               {$page.url.pathname === item.route
                 ? 'bg-green-100 text-green-600'
                 : 'text-gray-600 hover:bg-gray-100'}"
      >
        <svelte:component this={item.icon} size={22} />

        {#if !collapsed}
        <span>{item.label}</span>
        {/if}
      </button>
    {/each}
        
  </nav>
</aside>