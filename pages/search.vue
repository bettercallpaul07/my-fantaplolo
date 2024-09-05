<template>
  <div class="container mx-auto p-4">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Cerca giocatore..."
      class="w-full p-2 mb-4 border rounded"
    />
    <div v-if="filteredData.length === 1" class="single-result">
      <div class="player-card bg-white shadow-md rounded-lg p-4 mb-4">
        <div class="player-info">
          <span class="player-name text-lg font-bold">{{ filteredData[0][0] }}</span>
          <div class="player-details flex flex-wrap gap-2 mt-2">
            <span class="badge bg-blue-500 text-white px-2 py-1 rounded text-sm">{{ filteredData[0][1] }}</span> <!-- Team -->
            <span class="badge bg-green-500 text-white px-2 py-1 rounded text-sm">{{ filteredData[0][4] }}</span> <!-- Role -->
          </div>
          <div class="player-other-details mt-4">
            <div class="data-section">
              <h3 class="text-md font-semibold">2024</h3>
              <div v-for="(header, index) in csvHeaders.slice(5)" :key="index" class="data-card mt-2">
                <span class="header font-semibold">{{ header }}:</span> <span class="text-sm">{{ filteredData[0][index + 5] }}</span>
              </div>
            </div>
          </div>
          <button @click="addPlayer(filteredData[0])" class="add-button">
            <i class="fas fa-plus"></i> Aggiungi
          </button>
        </div>
      </div>
    </div>
    <div v-else class="results-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="(player, index) in filteredData" :key="index" class="player-card bg-white shadow-md rounded-lg p-4 mb-4">
        <div class="player-info">
          <span class="player-name text-lg font-bold">{{ player[0] }}</span>
          <div class="player-details flex flex-wrap gap-2 mt-2">
            <span class="badge bg-blue-500 text-white px-2 py-1 rounded text-sm">{{ player[1] }}</span> <!-- Team -->
            <span class="badge bg-green-500 text-white px-2 py-1 rounded text-sm">{{ player[4] }}</span> <!-- Role -->
          </div>
          <div class="player-other-details mt-4">
            <div class="data-section">
              <h3 class="text-md font-semibold">2024</h3>
              <div v-for="(header, index) in csvHeaders.slice(5)" :key="index" class="data-card mt-2">
                <span class="header font-semibold">{{ header }}:</span> <span class="text-sm">{{ player[index + 5] }}</span>
              </div>
            </div>
          </div>
          <button @click="addPlayer(player)" class="add-button">
            <font-awesome-icon icon="plus" /> Aggiungi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Papa from 'papaparse'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { supabase } from '~/src/supabase'

library.add(faPlus)

definePageMeta({
  layout: 'dashboard'
})

const searchQuery = ref('')
const csvData = ref([])
const csvHeaders = ref([])

const loadCSV = () => {
  const filePath = './csv/Quot.csv' // Modifica il percorso del file CSV
  fetch(filePath)
    .then(response => response.text())
    .then(data => {
      Papa.parse(data, {
        complete: (results) => {
          csvHeaders.value = results.data[0]
          csvData.value = results.data.slice(1)
        },
        header: false
      })
    })
}

const filteredData = computed(() => {
  if (searchQuery.value.length < 1) return []
  return csvData.value.filter(row => {
    if (searchQuery.value.length === 1) {
      return row.some(cell => cell.toString().toLowerCase().includes(searchQuery.value.toLowerCase()) && cell.toString().toLowerCase() !== 'np')
    }
    return row.some(cell => cell.toString().toLowerCase().includes(searchQuery.value.toLowerCase()))
  })
})

const router = useRouter()

const addPlayer = async (player) => {
  Swal.fire({
    title: 'Inserisci il costo del giocatore',
    input: 'number',
    inputAttributes: {
      min: 0,
      max: 500,
      step: 1
    },
    showCancelButton: true,
    confirmButtonText: 'Aggiungi',
    cancelButtonText: 'Annulla',
    preConfirm: (value) => {
      if (value < 0 || value > 500) {
        Swal.showValidationMessage('Il costo deve essere un numero tra 0 e 500')
        return false
      }
      return value
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      const cost = result.value
      const storedPlayers = JSON.parse(localStorage.getItem('selectedPlayers')) || []
      storedPlayers.push({ player, cost })
      localStorage.setItem('selectedPlayers', JSON.stringify(storedPlayers))

      // Decrementa il numero di portieri se l'RM del giocatore è "POR"
      if (player[4] === 'Por') {
        const portieri = JSON.parse(localStorage.getItem('portieri')) || 3
        localStorage.setItem('portieri', portieri - 1)
      }

      // Aggiungi il giocatore a supabase
      try {
        const { data, error } = await supabase
          .from('players')
          .insert([{ player: player[0], cost, role: player[4], team: player[1] }])
        if (error) {
          throw error
        }
      } catch (error) {
        console.error('Errore durante l\'inserimento del giocatore:', error)
      }

      Swal.fire('Giocatore aggiunto!', '', 'success')

      router.push('/')
    }
  })
}

onMounted(() => {
  loadCSV()
})
</script>

<style scoped>
.container {
  max-width: 100%;
  overflow-x: auto;
}

.table-responsive {
  display: block;
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  text-align: left;
  padding: 8px;
}

thead th {
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}

@media (max-width: 1400px) {
  table, thead, tbody, th, td, tr {
    display: block;
  }

  thead {
    display: none;
  }

  tr {
    margin-bottom: 1rem;
    border-bottom: 1px solid transparent;
  }

  td {
    text-align: right;
    padding-left: 50%;
    position: relative;
  }

  td::before {
    content: attr(data-label);
    position: absolute;
    left: 0;
    width: 50%;
    padding-left: 1rem;
    font-weight: bold;
    text-align: left;
  }

  th, td {
    padding: 4px;
  }

  input {
    font-size: 14px;
  }

  button {
    font-size: 14px;
    padding: 6px 12px;
  }

  .player-row {
    margin-bottom: 2rem; /* Aggiunge uno spazio vuoto tra i giocatori */
    border-bottom: 2px solid #ddd; /* Rende più evidente lo stacco tra i giocatori */
  }
}

.single-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.player-card {
  background-color: white;
  padding: 2rem; /* Aumentato il padding */
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 1rem;
  width: 100%;
  max-width: 800px; /* Aumentato il max-width */
}

.player-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem; /* Aumentato il margin-bottom */
}

.player-name {
  font-weight: bold;
  font-size: 2rem; /* Aumentato il font-size */
}

.player-details {
  font-size: 1.5rem; /* Aumentato il font-size */
  color: #555;
  display: flex;
  gap: 0.5rem;
}

.badge {
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem; /* text-sm */
}

.bg-blue-500 {
  background-color: #3b82f6;
}

.bg-green-500 {
  background-color: #10b981;
}

.player-other-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.data-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
}

.data-card {
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex: 1 1 calc(33.333% - 1rem); /* Card quadrate e compatte */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.data-card .header {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.player-cost {
  width: 60px; /* Aumentato il width */
  height: 60px; /* Aumentato il height */
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.5rem; /* Aumentato il font-size */
  position: absolute;
  top: 1rem;
  right: 1rem;
}

button {
  transition: transform 0.2s;
}

button:hover {
  transform: scale(1.1);
}

.add-button {
  background: #28a745;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  color: white;
  padding: 0.25rem 0.5rem;
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.add-button i {
  font-size: 1.2rem;
}
</style>