<template>
  <div class="container mx-auto p-4">
    <div class="grid-container">
      <div class="card bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center mb-4">
        <h2 class="text-4xl font-bold">{{ fantamilioniDisponibili }}</h2>
        <p class="text-lg">FML</p>
      </div>

      <div class="card bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center mb-4">
        <h2 class="text-4xl font-bold">{{ fantamilioniSpesi }}</h2>
        <p class="text-lg">FML spesi</p>
      </div>

      <div class="card bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center mb-4">
        <h2 class="text-4xl font-bold">{{ oneShotValue }}</h2>
        <p class="text-lg">One Shot</p>
      </div>

      <div class="card bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center mb-4">
        <h2 class="text-4xl font-bold">{{ giocatoriDisponibili }}</h2>
        <p class="text-lg">Da Prendere</p>
      </div>

      <div class="card bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center mb-4">
        <h2 class="text-4xl font-bold">{{ giocatoriDiRuolo }}</h2>
        <p class="text-lg">Di movimento</p>
      </div>

      <div class="card bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center mb-4">
        <h2 class="text-4xl font-bold">{{ portieri }}</h2>
        <p class="text-lg">Portieri</p>
      </div>
    </div>

    <!-- Blocco per aggiungere rapidamente i giocatori -->
    <div class="quick-add-player mt-8">
      <h2 class="text-2xl font-bold mb-4">Aggiunta rapida</h2>
      <div class="flex items-center mb-4">
        <input v-model="searchQuery" @input="searchPlayer" type="text" placeholder="Cerca giocatore" class="input-search p-2 border rounded-lg flex-1 mr-2" />
      </div>

      <div v-if="searchResults.length" class="search-results mb-4">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-xl font-bold">Risultati della ricerca</h3>
          <button @click="clearSearch" class="btn-close bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-lg">Chiudi</button>
        </div>
        <ul>
          <li v-for="(player, index) in searchResults" :key="index" class="flex justify-between items-center p-2 border-b">
            <span>{{ player[0] }} - {{ player[1] }} - {{ player[4] }}</span>
            <button @click="promptPlayerCost(player)" class="btn-add bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-lg">Aggiungi</button>
          </li>
        </ul>
      </div>
    </div>


    <div class="quick-links mt-8">
        <h2 class="text-2xl font-bold mb-4">Link rapidi</h2>

        <ul>
          <li class="mb-4">
            <a href="https://content.fantacalcio.it/web/img/medium/543b023e-cdde-4e5e-8d9d-b8e02b86d216.jpg"  target="_blank" class="btn-open bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-lg">Moduli Mantra</a>
          </li>
          <li class="mb-4">
            <a href="https://content.fantacalcio.it/web/img/medium/64bc672b-f62b-4c8f-9363-a7993ee5758b.jpg" target="_blank" class="btn-open bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-lg">Griglia Portieri</a>
          </li>
          <li class="mb-4">
            <a href="https://www.fantacalcio.it/probabili-formazioni-serie-a"  target="_blank" class="btn-open bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-lg">Probabili formazioni</a>
          </li>
        </ul>

      </div>

    <div class="recent-players-container mt-8">
      <h2 class="text-2xl font-bold mb-4">Acquisti recenti</h2>
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
import { ref, onMounted, watch } from 'vue'
import Papa from 'papaparse'
import Swal from 'sweetalert2'
import { supabase } from '~/src/supabase'



  const oneShotValue = ref(0)
  const fantamilioniDisponibili = ref(1000)
  const fmlIniziali = ref(1000)
  const giocatoriDisponibili = ref(28)
  const giocatoriDiRuolo = ref(25)
  const portieri = ref(3)
  const fantamilioniSpesi = ref(0)
  const recentPlayers = ref([])

  const searchQuery = ref('')
  const searchResults = ref([])


  watch(searchQuery, async (newQuery) => {
  if (newQuery.length >= 2) {
    await searchPlayer()
  } else {
    searchResults.value = []
  }
})

function clearSearch() {
  searchQuery.value = ''
  searchResults.value = []
}

async function promptPlayerCost(player) {
  const { value: cost } = await Swal.fire({
    title: 'Inserisci il costo del giocatore',
    input: 'number',
    inputLabel: 'Costo',
    inputPlaceholder: 'Inserisci il costo del giocatore',
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) {
        return 'Devi inserire un costo!'
      }
    }
  })

  if (cost) {
    addPlayer(player, cost)
  }
}


async function searchPlayer() {
  const response = await fetch('./csv/Quot.csv')
  const csvData = await response.text()
  const parsedData = Papa.parse(csvData, { header: false }).data

  // Rimuovi l'intestazione del CSV dai risultati
  parsedData.shift()

  searchResults.value = parsedData.filter(player =>
    player[0].toLowerCase().includes(searchQuery.value.toLowerCase())
  )
}

async function addPlayer(player, cost) {
  const newPlayer = {
    player: player[0],
    team: player[1],
    role: player[4],
    cost: cost
  }

  const { data, error } = await supabase
    .from('players')
    .insert([newPlayer])

  if (error) {
    console.error('Errore nell\'aggiunta del giocatore:', error)
  } else {
    console.log('Giocatore aggiunto con successo:', data)
    // Aggiorna la lista dei giocatori recenti
    recentPlayers.value.unshift(newPlayer) // Aggiungi il nuovo giocatore all'inizio dell'array
    if (recentPlayers.value.length > 20) { // Limita la lista a 20 giocatori
      recentPlayers.value.pop() // Rimuovi l'ultimo giocatore
    }
      // Ricarica la pagina
      location.reload()
  }
}

onMounted(async () => {
  const { data: players, error } = await supabase
    .from('players')
    .select('*')
  if (error) {
    console.error('Errore durante il recupero dei giocatori:', error)
    return
  }
  recentPlayers.value = players.slice(-20).reverse() // Mostra solo gli ultimi 20 giocatori
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
  oneShotValue.value = fantamilioniDisponibili.value - giocatoriDisponibili.value + 1
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


.team-badge, .role-badge {
  display: inline-block;
  margin-right: 0.5rem;
}

.btn-search, .btn-add {
  transition: transform 0.2s ease;
}

.btn-search:hover, .btn-add:hover {
  transform: scale(1.05);
}

.input-search {
  width: 100%;
  max-width: 300px;
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