<template>
  <div class="container mx-auto p-4">
    <div class="grid-container">
      <div class="card bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center mb-4">
        <h2 class="text-4xl font-bold">{{ fantamilioniDisponibili }}</h2>
        <p class="text-lg">FML</p>
      </div>

      <div class="card bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center mb-4">
        <h2 class="text-4xl font-bold">{{ giocatoriDisponibili }}</h2>
        <p class="text-lg">Slot</p>
      </div>

      <div class="card bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center mb-4">
        <h2 class="text-4xl font-bold">{{ giocatoriDiRuolo }}</h2>
        <p class="text-lg">Movimento</p>
      </div>

      <div class="card bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center mb-4">
        <h2 class="text-4xl font-bold">{{ portieri }}</h2>
        <p class="text-lg">Portieri</p>
      </div>

      <div class="card bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center mb-4">
        <h2 class="text-4xl font-bold">{{ fantamilioniSpesi }}</h2>
        <p class="text-lg">FML spesi</p>
      </div>

      <div class="card bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center mb-4">
        <h2 class="text-4xl font-bold">{{ oneShotValue }}</h2>
        <p class="text-lg">One Shot</p>
      </div>
    </div>

    <div class="recent-players-container mt-8">
      <h2 class="text-2xl font-bold mb-4">Ultimi 10 giocatori acquistati</h2>
      <div class="recent-players-grid">
        <div v-for="(player, index) in recentPlayers" :key="index" class="player-card mb-4">
          <div class="player-info">
            <span class="player-name">{{ player.player }}</span>
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
import { supabase } from '~/src/supabase'



  const oneShotValue = ref(0)
  const fantamilioniDisponibili = ref(500)
  const fmlIniziali = ref(500)
  const giocatoriDisponibili = ref(28)
  const giocatoriDiRuolo = ref(25)
  const portieri = ref(3)
  const fantamilioniSpesi = ref(0)
  const recentPlayers = ref([])

  // const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
  // const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  // const supabase = createClient(supabaseUrl, supabaseKey)


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
  fantamilioniDisponibili.value = fmlIniziali.value - fantamilioniSpesi.value
  giocatoriDisponibili.value = 28 - players.length
  portieri.value = 3 - players.filter(player => {
    return player.role === 'Por'
  }).length 
  giocatoriDiRuolo.value = 25 - players.filter(player => player.role !== 'Por').length
  oneShotValue.value = fantamilioniDisponibili.value - giocatoriDisponibili.value
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.card {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
}

.card h2 {
  font-size: 2rem; /* text-4xl */
}

.card p {
  font-size: 0.75rem; /* text-sm */
  line-height: 1.25rem; /* Aumenta l'altezza della linea per migliorare la leggibilità */
  margin: 0.5rem 0; /* Aggiungi margine per separare meglio il testo */
  color: #333; /* Colore del testo per migliorare il contrasto */
}

.recent-players-container {
  margin-top: 2rem;
}

.recent-players-container h2 {
  font-size: 1.5rem; /* text-2xl */
  font-weight: bold;
  margin-bottom: 1rem;
}

.recent-players-grid {
  display: flex;
  flex-direction: column;
}

.player-card {
  background: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
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
  font-size: 1rem; /* text-lg */
}

.player-details {
  font-size: 0.875rem; /* text-sm */
}

.player-cost {
  font-size: 1rem; /* text-lg */
  font-weight: bold;
}

@media (max-width: 1024px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }

  .card h2 {
    font-size: 1.5rem; /* text-3xl */
  }

  .card p {
    font-size: 0.875rem; /* text-sm */
  }

  .recent-players-container h2 {
    font-size: 1.25rem; /* text-xl */
  }

  .player-name {
    font-size: 0.875rem; /* text-sm */
  }

  .player-details {
    font-size: 0.75rem; /* text-xs */
  }

  .player-cost {
    font-size: 0.875rem; /* text-sm */
  }
}

@media (max-width: 640px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .card {
    padding: 0.4rem;
  }

  .card h2 {
    font-size: 1.25rem; /* text-2xl */
  }

  .card p {
    font-size: 0.75rem; /* text-sm */
    line-height: 1.5rem; /* Aumenta ulteriormente l'altezza della linea per migliorare la leggibilità su schermi piccoli */
    margin: 0.25rem 0; /* Riduci il margine per mantenere il testo compatto */
  }

  .recent-players-container h2 {
    font-size: 1rem; /* text-lg */
  }

  .player-card {
    padding: 0.75rem;
  }

  .player-name {
    font-size: 0.75rem; /* text-sm */
  }

  .player-details {
    font-size: 0.625rem; /* text-xs */
  }

  .player-cost {
    font-size: 0.75rem; /* text-sm */
  }
}
</style>