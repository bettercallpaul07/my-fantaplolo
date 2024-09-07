<template>
  <div class="container mx-auto p-4">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Cerca giocatore o squadra..."
      class="w-full p-2 mb-4 border rounded"
    />

    <!-- Nuvolette per la ricerca per ruolo -->
    <div class="role-filters flex flex-wrap gap-2 mb-4">
      <span
        v-for="role in roles"
        :key="role"
        @click="filterByRole(role)"
        :class="{'selected-role': selectedRole === role, 'role-badge': true}"
      >
        {{ role }}
      </span>
    </div>



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
              <div v-for="(header, index) in csvHeaders.slice(5)" :key="index" class="data-card mt-2">
                <span class="header font-semibold">{{ header }}:</span> <span class="text-sm">{{ filteredData[0][index + 5] }}</span>
              </div>
            </div>
          </div>
          <button @click="addPlayer(player)" class="add-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg mt-4 flex items-center justify-center">
            <font-awesome-icon icon="plus" class="mr-2" /> Aggiungi
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
              <div v-for="(header, index) in csvHeaders.slice(5)" :key="index" class="data-card mt-2">
                <span class="header font-semibold">{{ header }}:</span> <span class="text-sm">{{ player[index + 5] }}</span>
              </div>
            </div>
          </div>
          <button @click="addPlayer(player)" class="add-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg mt-4 flex items-center justify-center">
            <font-awesome-icon icon="plus" class="mr-2" /> Aggiungi
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

import { supabase } from '~/src/supabase'

const roles = ['Pc', 'A', 'W', 'T', 'C', 'M', 'Dc', 'Dd', 'Ds', 'B', 'Por']
const selectedRole = ref('')


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
  let data = csvData.value

  if (searchQuery.value) {
    data = data.filter(player =>
      player[0].toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      player[1].toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedRole.value) {
    data = data.filter(player => player[4].toLowerCase().includes(selectedRole.value.toLowerCase()))
  }

  return data
})

function filterByRole(role) {
  selectedRole.value = role
}

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
.role-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.role-badge {
  background-color: #10b981; /* bg-green-500 */
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem; /* text-sm */
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.role-badge:hover {
  background-color: #059669; /* bg-green-700 */
}

.selected-role {
  background-color: #065f46; /* bg-green-900 */
}

.input-search {
  width: 100%;
  max-width: 300px;
}

.btn-search, .btn-add {
  transition: transform 0.2s ease;
}

.btn-search:hover, .btn-add:hover {
  transform: scale(1.05);
}

.team-badge, .role-badge {
  display: inline-block;
  margin-right: 0.5rem;
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

.data-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.data-card {
  background-color: #f9f9f9;
  padding: 0.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1 1 calc(33.333% - 1rem); /* Aggiunto per visualizzare 3 data-card per riga */
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

@media (max-width: 767px) {
  .data-card {
    flex: 1 1 calc(50% - 1rem); /* 2 card per riga nella versione mobile */
  }
}

@media (min-width: 768px) {
  .data-card {
    flex: 1 1 calc(33.333% - 1rem); /* 3 card per riga nella versione desktop */
  }
}
</style>