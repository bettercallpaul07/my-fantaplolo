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
      <ul class="role-list">
        <li v-for="(count, rm) in rmCounts" :key="rm" class="role-item">
          <span class="role-badge">{{ rm }}</span> <span class="count-badge">{{ count }}</span>
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
import { supabase } from '~/src/supabase'


// const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabase = createClient(supabaseUrl, supabaseKey)

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
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.team-players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.player-card {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.player-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.player-name {
  font-weight: bold;
  font-size: 1rem; /* text-lg */
}

.player-details {
  font-size: 0.875rem; /* text-sm */
}

.player-rm {
  font-size: 0.875rem; /* text-sm */
}

.player-cost {
  font-size: 1rem; /* text-lg */
  font-weight: bold;
  margin-top: 0.5rem;
}

.remove-button {
  background: #e3342f;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.rm-count {
  margin-top: 2rem;
  background: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.rm-count h3 {
  font-size: 1.5rem; /* text-xl */
  margin-bottom: 1rem;
}

.role-list {
  list-style: none;
  padding: 0;
}

.role-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.role-badge {
  background: #3490dc;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem; /* text-sm */
  margin-right: 0.5rem;
}

.count-badge {
  background: #38c172;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem; /* text-sm */
}

@media (max-width: 1024px) {
  .team-players-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .player-card {
    padding: 0.75rem;
  }

  .player-name {
    font-size: 0.875rem; /* text-sm */
  }

  .player-details, .player-rm, .player-cost {
    font-size: 0.75rem; /* text-xs */
  }

  .remove-button {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem; /* text-sm */
  }
}

@media (max-width: 640px) {
  .team-players-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .player-card {
    padding: 0.5rem;
  }

  .player-name {
    font-size: 0.75rem; /* text-sm */
  }

  .player-details, .player-rm, .player-cost {
    font-size: 0.625rem; /* text-xs */
  }

  .remove-button {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem; /* text-xs */
  }
}
</style>