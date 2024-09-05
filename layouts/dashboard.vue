<template>
  <div class="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex flex-col md:flex-row">
    <nav class="sidebar bg-gray-800 text-white hidden md:flex flex-col h-screen">
      <ul class="flex flex-col justify-around h-full">
        <li>
          <nuxt-link to="/" class="flex flex-col items-center" exact-active-class="active">
            <font-awesome-icon icon="home" size="2x" />
            <span class="text-xs mt-1">Home</span>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/search" class="flex flex-col items-center" exact-active-class="active">
            <font-awesome-icon icon="search" size="2x" />
            <span class="text-xs mt-1">Cerca</span>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/team" class="flex flex-col items-center" exact-active-class="active">
            <font-awesome-icon icon="users" size="2x" />
            <span class="text-xs mt-1">Team</span>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/obiettivi" class="flex flex-col items-center" exact-active-class="active">
            <font-awesome-icon icon="star" size="2x" />
            <span class="text-xs mt-1">Pref</span>
          </nuxt-link>
        </li>
      </ul>
    </nav>
    <div class="flex-1 p-4">
      <main class="flex-1 p-4 pb-16 md:pb-4">
        <NuxtPage />
      </main>
    </div>
    <nav class="bottom-nav bg-gray-800 text-white w-full flex justify-around py-4 fixed bottom-0 md:hidden">
      <ul class="flex justify-around w-full">
        <li>
          <nuxt-link to="/" class="flex flex-col items-center" exact-active-class="active">
            <font-awesome-icon icon="home" size="2x" />
            <span class="text-xs mt-1">Home</span>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/search" class="flex flex-col items-center" exact-active-class="active">
            <font-awesome-icon icon="search" size="2x" />
            <span class="text-xs mt-1">Cerca</span>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/team" class="flex flex-col items-center" exact-active-class="active">
            <font-awesome-icon icon="users" size="2x" />
            <span class="text-xs mt-1">Team</span>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/obiettivi" class="flex flex-col items-center" exact-active-class="active">
            <font-awesome-icon icon="star" size="2x" />
            <span class="text-xs mt-1">Pref</span>
          </nuxt-link>
        </li>
      </ul>
    </nav>
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

.pb-16 {
  padding-bottom: 4rem; /* Aggiunto padding inferiore per evitare che il testo si nasconda sotto la navbar mobile */
}

.md\:pb-4 {
  padding-bottom: 1rem; /* Padding inferiore per desktop */
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

.sidebar {
  display: none;
}

.bottom-nav {
  display: flex;
}

.active {
  background-color: #4a5568; /* Colore di sfondo per l'icona attiva */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Aggiunta ombra */
  border-radius: 0.5rem; /* Aggiunta bordi arrotondati */
  transition: background-color 0.3s, box-shadow 0.3s, transform 0.3s; /* Aggiunta transizione */
  transform: scale(1.1); /* Aggiunta effetto di ingrandimento */
}

@media (min-width: 768px) {
  .sidebar {
    display: flex;
    width: 10rem; /* Larghezza della sidebar ridotta */
    position: fixed;
    height: 100vh; /* Altezza della sidebar */
  }

  .bottom-nav {
    display: none;
  }

  .flex-1 {
    margin-left: 10rem; /* Margine sinistro per il contenuto quando la sidebar è visibile */
  }
}

@media (max-width: 767px) {
  .flex-1 {
    padding-bottom: 4rem; /* Aggiunto padding inferiore per evitare che il testo si nasconda sotto la navbar mobile */
  }

  .bottom-nav .active {
    width: 3.5rem; /* Aumenta la larghezza dell'icona attiva nella barra mobile */
    height: 3.5rem; /* Aumenta l'altezza dell'icona attiva nella barra mobile */
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>