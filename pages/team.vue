<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'dashboard'
})

const selectedPlayers = ref([])

onMounted(() => {
  const storedPlayers = localStorage.getItem('selectedPlayers')
  if (storedPlayers) {
    selectedPlayers.value = JSON.parse(storedPlayers)
  }
})
</script>

<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">Team</h2>
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border rounded">
        <thead>
          <tr>
            <th v-for="header in selectedPlayers[0]?.player || []" :key="header" class="px-4 py-2 border">{{ header }}</th>
            <th class="px-4 py-2 border">Costo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in selectedPlayers" :key="index">
            <td v-for="(cell, cellIndex) in entry.player" :key="cellIndex" class="px-4 py-2 border">{{ cell }}</td>
            <td class="px-4 py-2 border">{{ entry.cost }}</td>
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
  th, td {
    padding: 4px;
  }

  h2 {
    font-size: 18px;
  }
}
</style>