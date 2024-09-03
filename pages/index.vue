<template>
    <div class="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 p-4 flex flex-col">
        <div class="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mb-6 w-full md:w-2/3 lg:w-1/2">
            <input v-model="searchQuery" type="text" placeholder="Cerca una squadra o un giocatore..."
                class="w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500" />
        </div>
        <div class="flex-grow overflow-auto flex justify-center items-center">
            <transition name="fade" mode="out-in">
                <div v-if="isSearching" class="flex items-center justify-center">
                    <svg class="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z">
                        </path>
                    </svg>
                </div>
                <div v-else-if="searchQuery.length >= 3 && filteredData.length" class="w-full overflow-x-auto">
                    <table class="min-w-full bg-white shadow-lg rounded-lg">
                        <thead>
                            <tr>
                                <th
                                    class="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-medium text-gray-700 uppercase tracking-wider sticky left-0 bg-white z-10">
                                    Campo
                                </th>
                                <th v-for="(row, rowIndex) in filteredData" :key="rowIndex"
                                    class="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                                    {{ rowIndex + 1 }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(header, index) in csvHeaders" :key="index" class="hover:bg-gray-50">
                                <td
                                    class="py-2 px-4 border-b border-gray-200 font-medium text-gray-900 sticky left-0 bg-white z-10">
                                    {{ header }}</td>
                                <td v-for="(row, rowIndex) in filteredData" :key="rowIndex"
                                    class="py-2 px-4 border-b border-gray-200 text-gray-900">
                                    {{ row[index] }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import Papa from 'papaparse'

const searchQuery = ref('')
const isSearching = ref(false)
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
    if (searchQuery.value.length < 3) return []
    return csvData.value.filter(row =>
        row.some(cell => cell.toString().toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
})

watch(searchQuery, (newQuery) => {
    if (newQuery.length >= 3) {
        isSearching.value = true
        setTimeout(() => {
            isSearching.value = false
        }, 1500) // Durata dell'animazione aumentata
    }
})

onMounted(() => {
    loadCSV()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
    {
    opacity: 0;
}
</style>