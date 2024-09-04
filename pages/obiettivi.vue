<template>
    <div class="container mx-auto p-4">
      <div class="header">
        <h2 class="text-2xl font-bold mb-4">Aggiungi Nota Calciatore</h2>
      </div>
      <form @submit.prevent="addNote">
        <div class="mb-4">
          <label for="player" class="block text-gray-700 text-sm font-bold mb-2">Nome Calciatore:</label>
          <select v-model="selectedPlayer" id="player" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option v-for="player in players" :key="player" :value="player">{{ player }}</option>
          </select>
        </div>
        <div class="mb-4">
          <label for="note" class="block text-gray-700 text-sm font-bold mb-2">Nota:</label>
          <textarea v-model="note" id="note" rows="4" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
        </div>
        <div class="flex items-center justify-between">
          <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Aggiungi Nota
          </button>
        </div>
      </form>
      <div class="notes mt-8">
        <h2 class="text-2xl font-bold mb-4">Note Calciatori</h2>
        <div v-for="(note, index) in notes" :key="note.id" class="note-card">
          <div class="note-info">
            <span class="note-player">{{ note.player }}</span>
            <p class="note-text">{{ note.note }}</p>
          </div>
          <button @click="confirmRemoveNote(note.id)" class="remove-button">
            <font-awesome-icon :icon="['fas', 'trash-alt']" />
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import Swal from 'sweetalert2'
  import { createClient } from '@supabase/supabase-js'
  
  const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  const players = ref([])
  const selectedPlayer = ref('')
  const note = ref('')
  const notes = ref([])
  
  onMounted(async () => {
    await fetchPlayersFromCSV()
    await fetchNotesFromSupabase()
  })
  
  const fetchPlayersFromCSV = async () => {
    const response = await fetch('./csv/Quot.csv')
    const data = await response.text()
    const rows = data.split('\n').slice(1) // Salta l'intestazione
    players.value = rows.map(row => row.split(';')[0]).filter(name => name) // Prendi solo i nomi
  }
  
  const fetchNotesFromSupabase = async () => {
    const { data, error } = await supabase
      .from('obiettivi')
      .select('*')
    if (error) {
      console.error('Errore nel recuperare le note:', error)
    } else {
      notes.value = data
    }
  }
  
  const addNote = async () => {
    if (selectedPlayer.value && note.value) {
      const { data, error } = await supabase
        .from('obiettivi')
        .insert([{ player: selectedPlayer.value, note: note.value }])
      if (error) {
        console.error('Errore nel salvare la nota:', error)
      } else {
        Swal.fire('Aggiunto!', 'La nota è stata aggiunta con successo.', 'success').then(() => {
          location.reload()
        })
      }
    } else {
      alert('Per favore, compila tutti i campi.')
    }
  }
  
  const confirmRemoveNote = (noteId) => {
    Swal.fire({
      title: 'Sei sicuro?',
      text: "Non potrai annullare questa operazione!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sì, cancella!',
      cancelButtonText: 'No, annulla'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await removeNote(noteId)
        Swal.fire('Cancellato!', 'La nota è stata rimossa.', 'success')
      }
    })
  }
  
  const removeNote = async (noteId) => {
    const { error } = await supabase
      .from('obiettivi')
      .delete()
      .eq('id', noteId)
    if (error) {
      console.error('Errore nel cancellare la nota:', error)
    } else {
      notes.value = notes.value.filter(note => note.id !== noteId)
    }
  }
  </script>
  
  <style scoped>
  .container {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .header {
    text-align: center;
    margin-bottom: 20px;
  }
  
  form {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  label {
    font-weight: bold;
  }
  
  button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
  
  .notes {
    margin-top: 20px;
  }
  
  .note-card {
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .note-info {
    flex-grow: 1;
  }
  
  .note-player {
    font-weight: bold;
  }
  
  .note-text {
    margin-top: 0.5rem;
  }
  
  .remove-button {
    background: none;
    border: none;
    cursor: pointer;
    color: #e3342f;
  }
  
  .remove-button:hover {
    color: #cc1f1a;
  }
  </style>