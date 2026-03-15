<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { House, Bookmark, Bell, User } from 'lucide-svelte';
  import { userStore } from '$lib/stores/user';

  function goToRoute(route: string): void {
    goto(route);
  }
</script>

<footer class="fixed bottom-0 left-0 w-full border-t-2 bg-white py-5 z-50 md:hidden border-0">
  
  <nav class="mx-auto flex justify-center gap-x-14">

    <button
      aria-label="Home"
      class:text-green-600={$page.url.pathname === '/homepage'}
      on:click={() => goToRoute('/homepage')}
    >
      <House size={30} />
    </button>

    <button
      aria-label="Saved"
      class:text-green-600={$page.url.pathname === '/savedpage'}
      on:click={() => goToRoute('/savedpage')}
    >
      <Bookmark size={30} />
    </button>

    <button on:click={() => goToRoute('/addeditpage')}>
      <img
      src="/menu-icon.png"
      alt="Menu"
      class="absolute bottom-12 right-42 h-12 w-12 cursor-pointer"
      />
    </button>

    <button
      aria-label="Notifications"
      class:text-green-600={$page.url.pathname === '/notificationpage'}
      on:click={() => goToRoute('/notificationpage')}
    >
      <Bell size={30} />
    </button>

    {#if $userStore}

    <button
      aria-label="Profile"
      class:text-green-600={$page.url.pathname === '/profilepage'}
      on:click={() => goToRoute('/profilepage')}
    >
      <img src={$userStore?.photo_url} alt="pic" class="rounded-full h-9 w-9">
    </button>

    {:else}

    <button
      aria-label="Profile"
      class:text-green-600={$page.url.pathname === '/profilepage'}
      on:click={() => goToRoute('/profilepage')}
    >
      <User size={30} />
    </button>
    {/if}

    

  </nav>
  
</footer>