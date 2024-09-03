<script setup>
import { ref, onMounted, computed } from 'vue'
import Papa from 'papaparse'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

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

const addPlayer = (player) => {
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
  }).then((result) => {
    if (result.isConfirmed) {
      const cost = result.value
      const storedPlayers = JSON.parse(localStorage.getItem('selectedPlayers')) || []
      storedPlayers.push({ player, cost })
      localStorage.setItem('selectedPlayers', JSON.stringify(storedPlayers))
      Swal.fire('Aggiunto!', 'Il giocatore è stato aggiunto al team.', 'success')
      router.push('/')
    }
  })
}

onMounted(() => {
  loadCSV()
})
</script>

<template>
  <div class="container mx-auto p-4">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Cerca giocatore..."
      class="w-full p-2 mb-4 border rounded"
    />
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border rounded">
        <thead>
          <tr>
            <th v-for="header in csvHeaders" :key="header" class="px-4 py-2 border">{{ header }}</th>
            <th class="px-4 py-2 border">Azione</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in filteredData" :key="index">
            <td v-for="(cell, cellIndex) in row" :key="cellIndex" class="px-4 py-2 border">{{ cell }}</td>
            <td class="px-4 py-2 border">
              <button @click="addPlayer(row)" class="bg-blue-500 text-white px-4 py-2 rounded">Aggiungi</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 100%;
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

@media (max-width: 768px) {
  table, thead, tbody, th, td, tr {
    display: block;
  }

  thead tr {
    display: none;
  }

  tr {
    margin-bottom: 1rem;
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
}
</style>