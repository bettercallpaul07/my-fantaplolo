<template>
  <div class="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex">
    <nav class="bg-gray-800 text-white w-16 flex flex-col items-center py-4">
      <ul class="space-y-4">
        <li>
          <nuxt-link to="/" class="flex flex-col items-center">
            <font-awesome-icon icon="home" size="2x" />
            <span class="text-xs mt-1">Home</span>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/search" class="flex flex-col items-center">
            <font-awesome-icon icon="search" size="2x" />
            <span class="text-xs mt-1">Cerca</span>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/team" class="flex flex-col items-center">
            <font-awesome-icon icon="users" size="2x" />
            <span class="text-xs mt-1">Team</span>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/obiettivi" class="flex flex-col items-center">
            <font-awesome-icon icon="star" size="2x" />
            <span class="text-xs mt-1">Pref</span>
          </nuxt-link>
        </li>
      </ul>
    </nav>
    <div class="flex-1 p-4">
      <header class="bg-white text-black p-4 shadow-md">
        <h1 class="text-2xl">Pannello di Controllo</h1>
      </header>
      <main class="flex-1 p-4">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>

<style scoped>
nav ul {
  list-style: none;
  padding: 0;
}

nav li {
  display: flex;
  justify-content: center;
}
</style>