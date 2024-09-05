<template>
  <div class="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex flex-col">
    <nav class="bg-gray-800 text-white w-full flex justify-around py-4">
      <ul class="flex justify-around w-full">
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
      <main class="flex-1 p-4">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>
<style scoped>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

html, body, #__nuxt, .flex-col {
  height: 100%;
}

.flex-1 {
  flex: 1;
}

.fixed {
  position: fixed;
}

.bottom-0 {
  bottom: 0;
}

.w-full {
  width: 100%;
}

.bg-gray-800 {
  background-color: #2d3748;
}

.text-white {
  color: #fff;
}

.p-4 {
  padding: 1rem;
}

.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.text-2xl {
  font-size: 1.5rem;
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-around {
  justify-content: space-around;
}

.mt-1 {
  margin-top: 0.25rem;
}

.text-xs {
  font-size: 0.75rem;
}
</style>