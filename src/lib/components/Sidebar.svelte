<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { House, Bookmark, Bell, User, Plus } from 'lucide-svelte';
  import type { ComponentType } from 'svelte';

  type Route = 
     | '/homepage'
     | '/savedpage'
     | '/notificationpage'
     | '/profilepage';

     interface NavItem {
      icon: ComponentType;
      label: string;
      route: Route;
     }

  const items: NavItem[] = [
    { icon: House, label: 'Home', route: '/homepage' },
    { icon: Bookmark, label: 'Saved', route: '/savedpage' },
    { icon: Bell, label: 'Notifications', route: '/notificationpage' },
    { icon: User, label: 'Profile', route: '/profilepage' }
  ];
</script>

<aside class="fixed left-0 top-0 z-40 hidden h-screen w-56 border-r bg-white md:block">
  <nav class="flex h-full flex-col gap-2 p-4">
    {#each items as item}
      <button
        on:click={() => goto(item.route)}
        class="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600
               hover:bg-gray-100
               {$page.url.pathname === item.route
                 ? 'bg-green-50 text-green-600'
                 : ''}"
      >
        <svelte:component this={item.icon} size={22} />
        <span class="text-sm font-medium">{item.label}</span>
      </button>
    {/each}

    <div class="flex-1" ></div>

    <button
      on:click={() => goto('/addeditpage')}
      class="mx-auto flex h-12 w-12 items-center justify-center
             rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700"
      aria-label="Add"
    >
      <Plus />
    </button>
  </nav>
</aside>