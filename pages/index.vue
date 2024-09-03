<template>
    <div class="container mx-auto p-4">
      <div class="card bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
        <h2 class="text-4xl font-bold">{{ fantamilioniDisponibili }}</h2>
        <p class="text-lg">Fantamilioni disponibili</p>
      </div>
  
      <div class="card bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
        <h2 class="text-4xl font-bold">{{ giocatoriDisponibili }}</h2>
        <p class="text-lg">Giocatori disponibili</p>
      </div>
  
      <div class="card bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
        <h2 class="text-4xl font-bold">{{ giocatoriDiRuolo }}</h2>
        <p class="text-lg">Giocatori di ruolo</p>
      </div>
  
      <div class="card bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
        <h2 class="text-4xl font-bold">{{ portieri }}</h2>
        <p class="text-lg">Portieri</p>
      </div>
  
      <div class="card bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
        <h2 class="text-4xl font-bold">{{ fantamilioniSpesi }}</h2>
        <p class="text-lg">Fantamilioni spesi</p>
      </div>
  
      <div class="card bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
        <h2 class="text-2xl font-bold mb-4">Ultimi 5 giocatori acquistati</h2>
        <ul class="list-disc list-inside">
          <li v-for="(player, index) in recentPlayers" :key="index" class="text-lg">
            {{ player.player[0] }} ({{ player.player[1] }}) - {{ player.player[2] }} - {{ player.cost }} Fantamilioni
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const fantamilioniDisponibili = ref(500)
  const giocatoriDisponibili = ref(28)
  const giocatoriDiRuolo = ref(25)
  const portieri = ref(3)
  const fantamilioniSpesi = ref(0)
  const recentPlayers = ref([])
  
  onMounted(() => {
    const storedPlayers = JSON.parse(localStorage.getItem('selectedPlayers')) || []
    recentPlayers.value = storedPlayers.slice(-5).reverse()
    updateCounts(storedPlayers)
  })
  
  const updateCounts = (players) => {
    const totalCost = players.reduce((sum, player) => sum + Number(player.cost), 0)
    fantamilioniSpesi.value = Math.min(totalCost, 999) // Assicurati che sia un numero a tre cifre
    fantamilioniDisponibili.value = 500 - fantamilioniSpesi.value
    giocatoriDisponibili.value = 28 - players.length
    portieri.value = 3 - players.filter(player => player.player[1] === 'POR').length
    giocatoriDiRuolo.value = 25 - players.filter(player => player.player[1] !== 'POR').length
  }
  </script>
  
  <style scoped>
  .container {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1rem;
  }
  
  @media (min-width: 768px) {
    .container {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  .card {
    background-color: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .list-disc {
    list-style-type: disc;
  }
  
  .list-inside {
    list-style-position: inside;
  }
  </style>