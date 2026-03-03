<!-- <script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { House, Bookmark, Bell, User } from 'lucide-svelte';

  const navItems = [
    { icon: House, label: 'Home', route: '/homepage' },
    { icon: Bookmark, label: 'Saved', route: '/savedpage' },
    { icon: Bell, label: 'Notifications', route: '/notificationpage' },
    { icon: User, label: 'Profile', route: '/profilepage' }
  ];

  function goTo(route) {
    goto(route);
  }
</script>

<aside
  class="fixed bottom-0 left-0 z-50 w-full bg-white border-t
         md:top-0 md:h-screen md:w-50 md:border-t-0 md:border-r"
>
  <nav
    class="flex justify-around py-3
           md:flex-col md:items-center md:gap-10 md:py-8"
  >
    {#each navItems as item}
      <button
        on:click={() => goTo(item.route)}
        class="group flex flex-col items-center gap-1 rounded-xl p-2 transition
               hover:bg-gray-100
               {$page.url.pathname === item.route
                 ? 'bg-green-100 text-green-600'
                 : 'text-gray-500'}"
        aria-label={item.label}
      >
        <svelte:component this={item.icon} size="28" />

        <span class="hidden md:block text-xs font-medium">
          {item.label}
        </span>
      </button>
    {/each}

    <button
      on:click={() => goTo('/addeditpage')}
      class="relative bottom-6 md:bottom-0 flex h-14 w-14 items-center justify-center
             rounded-full bg-green-600 text-white shadow-xl
             transition hover:scale-110"
      aria-label="Add"
    >
      +
    </button>
  </nav>
</aside> -->

<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { House, Bookmark, Bell, User, Plus } from 'lucide-svelte';

  const items = [
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
        <svelte:component this={item.icon} size="22" />
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