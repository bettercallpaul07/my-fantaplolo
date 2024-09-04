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
      <h2 class="text-4xl font-bold">{{ oneShotValue }}</h2>
      <p class="text-lg">One Shot</p>
    </div>

    <div class="recent-players-container">
      <h2 class="text-2xl font-bold mb-4">Ultimi 10 giocatori acquistati</h2>
      <div class="recent-players-grid">
        <div v-for="(player, index) in recentPlayers" :key="index" class="player-card">
          <div class="player-info">
            <span class="player-name">{{ player.player}}</span>
            <span class="player-details">({{ player.team }}) - {{ player.role }}</span>
          </div>
          <div class="player-cost">
            <span>{{ player.cost }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { createClient } from '@supabase/supabase-js'

  const oneShotValue = ref(0)
  const fantamilioniDisponibili = ref(500)
  const giocatoriDisponibili = ref(28)
  const giocatoriDiRuolo = ref(25)
  const portieri = ref(3)
  const fantamilioniSpesi = ref(0)
  const recentPlayers = ref([])

  const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

  const supabase = createClient(supabaseUrl, supabaseKey)


  onMounted(async () => {
  const { data: players, error } = await supabase
    .from('players')
    .select('*')
  if (error) {
    console.error('Errore durante il recupero dei giocatori:', error)
    return
  }
  recentPlayers.value = players.slice(-10).reverse()
  updateCounts(players)
})

const updateCounts = (players) => {
  const totalCost = players.reduce((sum, player) => sum + Number(player.cost), 0)
  fantamilioniSpesi.value = Math.min(totalCost, 999) // Assicurati che sia un numero a tre cifre
  fantamilioniDisponibili.value = 500 - fantamilioniSpesi.value
  giocatoriDisponibili.value = 28 - players.length
  portieri.value = 3 - players.filter(player => {
    console.log(player.player) // Aggiungi il console log qui
  
    return player.player[4] === 'POR'
  }).length
  giocatoriDiRuolo.value = 25 - players.filter(player => player.player[5] !== 'POR').length
  oneShotValue.value = fantamilioniDisponibili.value - giocatoriDisponibili.value
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

.recent-players-container {
  grid-column: 1 / -1;
  width: 100%;
}

.recent-players-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
}

@media (min-width: 768px) {
  .recent-players-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.player-card {
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.player-info {
  display: flex;
  flex-direction: column;
}

.player-name {
  font-weight: bold;
  font-size: 1.2rem;
}

.player-details {
  font-size: 1rem;
  color: #555;
}

.player-cost {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .card h2 {
    font-size: 1.5rem;
  }

  .card p {
    font-size: 1rem;
  }

  .player-name {
    font-size: 1rem;
  }

  .player-details {
    font-size: 0.9rem;
  }

  .player-cost {
    width: 30px;
    height: 30px;
    font-size: 0.9rem;
  }
}
</style>