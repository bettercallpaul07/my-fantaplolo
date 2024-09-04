<template>
  <div class="container mx-auto p-4">
    <div class="header">
      <h2 class="text-2xl font-bold mb-4">Team</h2>
    </div>
    <div class="team-players-grid">
      <div v-for="(player, index) in selectedPlayers" :key="index" class="player-card">
        <div class="player-info">
          <span class="player-name">{{ player.player }}</span>
          <span class="player-details">({{ player.team }})</span>
          <span class="player-rm">{{ player.role }}</span> <!-- Aggiungi RM -->
        </div>
        <div class="player-cost">
          <span>{{ player.cost }}</span>
        </div>
        <button @click="confirmRemovePlayer(index, player.id)" class="remove-button">
          <font-awesome-icon :icon="['fas', 'trash-alt']" />
        </button>
      </div>
    </div>
    <div class="rm-count">
      <h3 class="text-xl font-bold mt-4">Conteggio Ruoli</h3>
      <ul>
        <li v-for="(count, rm) in rmCounts" :key="rm">
          <span class="role-badge">{{ rm }}</span>: <span class="count-badge">{{ count }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createClient } from '@supabase/supabase-js'


const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

const supabase = createClient(supabaseUrl, supabaseKey)

const selectedPlayers = ref([])
const rmCounts = ref({})

onMounted(async () => {
  await fetchPlayersFromSupabase()
  updateRmCounts()
})

const fetchPlayersFromSupabase = async () => {
  const { data, error } = await supabase
    .from('players')
    .select('*')
  if (error) {
    console.error('Errore nel recuperare i giocatori:', error)
  } else {
    selectedPlayers.value = data
    updateRmCounts()
  }
}


definePageMeta({
  layout: 'dashboard'
})

const confirmRemovePlayer = (index, playerId) => {
  Swal.fire({
    title: 'Sei sicuro?',
    text: "Non potrai annullare questa operazione!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sì, cancella!',
    cancelButtonText: 'No, annulla'
  }).then(async (result) => {
    if (result.isConfirmed) {
      await removePlayer(index, playerId)
      Swal.fire('Cancellato!', 'Il giocatore è stato rimosso dal team.', 'success')
    }
  })
}

const removePlayer = async (index, playerId) => {
  const { error } = await supabase
    .from('players')
    .delete()
    .eq('id', playerId)
  if (error) {
    console.error('Errore nel cancellare il giocatore:', error)
  } else {
    selectedPlayers.value.splice(index, 1)
    updateRmCounts()
  }
}



const updateRmCounts = () => {
  const counts = {}
  selectedPlayers.value.forEach(player => {
    const rm = player.role
    if (counts[rm]) {
      counts[rm]++
    } else {
      counts[rm] = 1
    }
  })
  rmCounts.value = counts
}

</script>

<style scoped>
.container {
  max-width: 100%;
  overflow-x: auto;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.team-players-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 schede per riga */
  gap: 1rem;
}

/* Media query per rendere la sezione responsive */
@media (max-width: 768px) {
  .rm-count li {
    font-size: 0.875rem; /* Riduci la dimensione del testo su schermi piccoli */
  }

  .role-badge, .count-badge {
    padding: 0.1rem 0.3rem; /* Riduci il padding delle nuvolette su schermi piccoli */
  }

  .team-players-grid {
    grid-template-columns: 1fr; /* 1 scheda per riga su schermi piccoli */
  }
}


.player-card {
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.player-info {
  text-align: center;
}

.player-name {
  font-weight: bold;
  font-size: 1.2rem;
}

.player-details {
  font-size: 1rem;
  color: #555;
  margin-right: 0.2rem; /* Aggiungi margine per distanziare */
  margin-left: 0.2rem;
}

.player-rm {
  font-size: 1rem;
  color: white;
  background-color: #007bff;
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  margin-top: 0.5rem; /* Aggiungi margine per distanziare */
}

.player-cost {
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 0.5rem;
}

.remove-button {
  background: red;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  color: white;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
}

.rm-count {
  margin-top: 2rem;
  text-align: center;
}

.rm-count ul {
  list-style-type: none;
  padding: 0;
}

.rm-count li {
  font-size: 1rem;
  margin: 0.5rem 0;
}

.role-badge {
  background-color: #007bff;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
}

.count-badge {
  background-color: #28a745;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
}
</style>