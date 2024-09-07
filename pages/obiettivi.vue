<template>
  <div class="container mx-auto p-4">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Cerca giocatore..."
      class="w-full p-2 mb-4 border rounded"
    />
    <ul v-if="searchQuery && filteredData.length" class="suggestions-list bg-white shadow-md rounded-lg p-2">
      <li v-for="(player, index) in filteredData" :key="index" @click="selectPlayer(player)" class="suggestion-item p-2 cursor-pointer hover:bg-gray-200">
        {{ player[0] }} - {{ player[1] }} - {{ player[4] }}
      </li>
    </ul>
    <div v-if="selectedPlayer" class="single-result mt-4">
      <div class="player-card bg-white shadow-md rounded-lg p-4 mb-4">
        <div class="player-info">
          <span class="player-name text-lg font-bold">{{ selectedPlayer[0] }}</span>
          <div class="player-details flex flex-wrap gap-2 mt-2">
            <span class="badge bg-blue-500 text-white px-2 py-1 rounded text-sm">{{ selectedPlayer[1] }}</span> <!-- Team -->
            <span class="badge bg-green-500 text-white px-2 py-1 rounded text-sm">{{ selectedPlayer[4] }}</span> <!-- Role -->
          </div>
          <div class="player-other-details mt-4">
            <div class="data-section">
              <h3 class="text-md font-semibold">2024</h3>
              <div v-for="(header, index) in csvHeaders.slice(5)" :key="index" class="data-card mt-2">
                <span class="header font-semibold">{{ header }}:</span> <span class="text-sm">{{ selectedPlayer[index + 5] }}</span>
              </div>
            </div>
          </div>
          <textarea v-model="note" placeholder="Aggiungi una nota..." class="w-full p-2 mt-4 border rounded"></textarea>
          <button @click="addPlayer(selectedPlayer)" class="add-button mt-2">
            <font-awesome-icon icon="plus" /> Aggiungi
          </button>
          <button @click="getSuggestions" class="btn-ia mt-2 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition duration-300">
            <font-awesome-icon icon="robot" /> IA
          </button>
          <div v-if="aiResponse" class="ai-response mt-4 p-4 bg-gray-100 border border-gray-300 rounded shadow">
            <h3 class="text-lg font-semibold mb-2">Risposta dell'AI:</h3>
            <p class="text-gray-700">{{ aiResponse }}</p>
        </div>
        </div>
      </div>
    </div>
    <div class="obiettivi mt-8">
      <h2 class="text-xl font-bold mb-4">Obiettivi</h2>
      <ul>
        <li v-for="(obiettivo, index) in obiettivi" :key="index" class="obiettivo-item flex justify-between items-center p-2 border-b">
          <div>
            <span>{{ obiettivo.player }}</span>
            <p class="text-sm text-gray-300">{{ obiettivo.note }}</p>
          </div>
          <button @click="removeObiettivo(obiettivo.id)" class="remove-button text-red-500">
            <font-awesome-icon icon="trash" />
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import Papa from 'papaparse'
import Swal from 'sweetalert2'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { supabase } from '~/src/supabase'

library.add(faPlus, faTrash)

const searchQuery = ref('')
const csvHeaders = ref([])
const csvData = ref([])
const filteredData = ref([])
const selectedPlayer = ref(null)
const note = ref('')
const obiettivi = ref([])
const aiResponse = ref('');

const selectPlayer = (player) => {
  selectedPlayer.value = player
  searchQuery.value = ''
  filteredData.value = []
}

onMounted(() => {
  loadCSV()
  fetchObiettivi()
})

const getSuggestions = async () => {
  if (!selectedPlayer.value) {
    alert("Seleziona un giocatore prima di cliccare su IA.");
    return;
  }

  const playerName = selectedPlayer.value[0];
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Sei un assistente che fornisce suggerimenti su un asta (con 10 concorrenti) del fantacalcio mantra da 500 crediti. I giocatori in totale sono 28; 25 di movimento e 3 portieri.' },
        { role: 'user', content: `Suggerisci se ${playerName} è da acquistare e indicativamente a che cifra` }
      ],
      max_tokens: 100
    })
  });

  if (response.status === 429) {
    alert("Hai superato il limite di richieste. Attendi un momento prima di riprovare.");
    return;
  }

  if (response.status === 402) {
    alert("Hai superato la tua quota attuale. Verifica il tuo piano e i dettagli di fatturazione.");
    return;
  }

  if (response.ok) {
    const data = await response.json();
    console.log('Risposta API:', data); // Log di debug
    if (data.choices && data.choices.length > 0) {
      aiResponse.value = data.choices[0].message.content;
    } else {
      alert("Nessuna risposta trovata per il giocatore selezionato.");
    }
  } else {
    alert("Errore nella richiesta: " + response.statusText);
  }
};

const loadCSV = () => {
  const filePath = './csv/Quot.csv' // Modifica il percorso del file CSV
  fetch(filePath)
    .then(response => response.text())
    .then(data => {
      Papa.parse(data, {
        header: false,
        delimiter: ';',
        complete: (results) => {
          csvHeaders.value = results.data[0]
          csvData.value = results.data.slice(1)
          filteredData.value = csvData.value
        }
      })
    })
}

const filterPlayers = () => {
  const query = searchQuery.value.toLowerCase()
  filteredData.value = csvData.value.filter(player => 
    player[0].toLowerCase().includes(query) ||
    player[1].toLowerCase().includes(query) ||
    player[4].toLowerCase().includes(query)
  )
}



const fetchObiettivi = async () => {
  const { data, error } = await supabase
    .from('obiettivi')
    .select('*')
  if (error) {
    console.error('Error fetching obiettivi:', error)
  } else {
    obiettivi.value = data
  }
}

const addPlayer = async (player) => {
  const { data, error } = await supabase
    .from('obiettivi')
    .insert([
      { player: player[0], note: note.value }
    ])
  if (error) {
    Swal.fire('Errore', 'Non è stato possibile aggiungere il giocatore', 'error')
  } else {
    Swal.fire('Successo', 'Giocatore aggiunto con successo', 'success')
    fetchObiettivi()
    note.value = ''
    selectedPlayer.value = null
  }
}

const removeObiettivo = async (id) => {
  const { data, error } = await supabase
    .from('obiettivi')
    .delete()
    .eq('id', id)
  if (error) {
    Swal.fire('Errore', 'Non è stato possibile rimuovere l\'obiettivo', 'error')
  } else {
    Swal.fire('Successo', 'Obiettivo rimosso con successo', 'success')
    fetchObiettivi()
  }
}

watch(searchQuery, filterPlayers)
</script>
<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}

.player-card {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
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
  display: flex;
  flex-wrap: wrap;
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

.data-section {
  margin-top: 1rem;
}

.data-card {
  margin-bottom: 0.5rem;
}

.header {
  font-weight: bold;
  font-size: 0.875rem; /* text-sm */
}

.text-sm {
  font-size: 0.875rem;
}

.text-md {
  font-size: 1rem;
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
  padding: 0.5rem 1rem;
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

.suggestions-list {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  margin-top: -1rem;
}

.suggestion-item {
  padding: 0.5rem;
  cursor: pointer;
}

.suggestion-item:hover {
  background-color: #f0f0f0;
}

.obiettivi {
  margin-top: 2rem;
}

.obiettivo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid #ddd;
}

.remove-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #e3342f;
}
</style>