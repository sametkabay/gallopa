<template>
  <div class="round-list">
    <div class="rounds-container">
      <div v-for="round in rounds" :key="round.id" class="round-section">
        <h3>{{ round.name }} ({{ round.range }}m)</h3>
        <div class="round-content">
          <div class="participants-list">
            <h4>Participants</h4>
            <ul>
              <li 
                v-for="horse in getRoundHorses(round.id)" 
                :key="horse.id"
                :class="{ 'selected-horse': isSelectedHorse(horse.id) }"
              >
                {{ horse.name }}
              </li>
            </ul>
          </div>
          <div class="results-list">
            <h4>Results</h4>
            <ul>
              <li v-for="i in 10" :key="i" class="result-item">
                <span v-if="getCurrentPosition(round.id, i)" :class="getCurrentPositionClass(round.id, i)">
                  {{ i }}. {{ getCurrentPosition(round.id, i) }}
                </span>
                <span v-else class="result-placeholder">
                  Place {{ i }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { roundList } from '../store/round-list'

const store = useStore()

const rounds = computed(() => roundList)
const selectedHorse = computed(() => store.getters.getSelectedHorse)


const getRoundHorses = (roundId: number) => {
  return store.getters.getRoundHorses(roundId)
}


const getCurrentPosition = (roundId: number, position: number) => {
  const finishedOrder = store.getters.getFinishedOrder(roundId)
  const roundResults = store.state.result[roundId] || []
  
  if (position <= finishedOrder.length) {
    const finishedHorseId = finishedOrder[position - 1]
    const horse = getRoundHorses(roundId).find((h: any) => h.id === finishedHorseId)
    const result = horse ? horse.name : 'Unknown'
    console.log(`Position ${position}: Finished horse - ${result}`)
    return result
  }
  
  const ongoingHorses = roundResults
    .filter((result: any) => !result.isFinished)
    .sort((a: any, b: any) => b.distance - a.distance)
  
  const ongoingIndex = position - finishedOrder.length - 1
  
  if (ongoingIndex >= 0 && ongoingIndex < ongoingHorses.length) {
    const ongoingHorse = ongoingHorses[ongoingIndex]
    const horse = getRoundHorses(roundId).find((h: any) => h.id === ongoingHorse.horseId)
    return horse ? horse.name : 'Unknown'
  }
  
  return null
}

const getCurrentPositionClass = (roundId: number, position: number) => {
  const finishedOrder = store.getters.getFinishedOrder(roundId)
  
  if (position <= finishedOrder.length) {
    return 'result-completed'
  } else {
    return 'result-ongoing'
  }
}

const isSelectedHorse = (horseId: string) => {
  return selectedHorse.value?.id === horseId
}

onMounted(() => {
  store.dispatch('initializeRoundHorses')
})
</script>

<style scoped>
.round-list {
  width: 350px;
  height: 600px;
  overflow: hidden;
}

.rounds-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: 600px;
  overflow-y: auto;
}

.round-section {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px;
  background-color: #f9f9f9;
}

.round-section h3 {
  margin: 0 0 4px 0;
  color: #333;
  font-size: 14px;
}

.round-content {
  display: flex;
  gap: 4px;
}

.participants-list,
.results-list {
  flex: 1;
  background-color: white;
  padding: 4px;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.participants-list h4,
.results-list h4 {
  margin: 0 0 4px 0;
  color: #555;
  font-size: 12px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 4px 0;
  color: #333;
  border-bottom: 1px solid #eee;
  font-size: 12px;
}

li:last-child {
  border-bottom: none;
}

.selected-horse {
  font-weight: bold;
  color: #1976d2;
}

.result-placeholder {
  color: #999;
  font-style: italic;
}

.result-completed {
  font-weight: bold;
  color: #2e7d32;
}

.result-ongoing {
  font-weight: bold;
  color: #1976d2;
}

.result-item {
  display: flex;
  align-items: center;
}
</style>
