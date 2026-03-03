<script>
  import { goto } from '$app/navigation';
	
  function navigateTologin() {
    goto(`/login`);
  }
</script>

<div class="min-h-screen w-full bg-cover bg-center flex flex-col justify-center"
     style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,1)),url('/image.png')">

  <div class="flex flex-col min-h-screen w-full max-w-md mx-auto justify-center items-center gap-14">

    <div class="w-20 h-10">
      <img src="/hat.png" alt="hat">
    </div>

    <h1 class="text-[20px] text-white mb-30">100K+ Premium Recipe</h1>

    <div class="flex flex-col">
      <h1 class="text-[50px] font-bold text-white text-center">
        Get <br> Cooking
      </h1>
      <p class="text-[20px] text-white text-center">
        Simple way to find Tasty Recipe
      </p>
    </div>

    <button
      on:click={navigateTologin}
      class="bg-[rgba(18,149,117,1)] text-white px-20 py-3 rounded-xl">
      Start Cooking →
    </button>

  </div>
</div>