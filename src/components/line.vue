<template>
  <div class="line" ref="lineRef" :class="{ 'selected-line': isSelectedHorse }">
    <span class="position-text">{{ horsePosition }}</span>
    <Horse 
      :colorCode="props.colorCode" 
      :isRunning="props.isRunning" 
      :horseId="props.horseId"
      :style="horseStyle"
    />
    <span class="distance-text">{{ remainingDistance }}m</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import Horse from './horse.vue'
import { calculateHorsePosition } from '../store/untils'
import { roundList } from '../store/round-list'

const store = useStore()
const lineRef = ref<HTMLElement>()

const props = defineProps<{
  colorCode: number[]
  isRunning: boolean
  horseId: string
}>()

const currentRound = computed(() => store.getters.getCurrentRound)
const currentRoundResult = computed(() => store.getters.getCurrentRoundResult)
const selectedHorse = computed(() => store.getters.getSelectedHorse)
const roundDistance = computed(() => {
  const round = roundList.find(r => r.id === currentRound.value)
  return round?.range || 1200
})

const horseResult = computed(() => {
  return currentRoundResult.value.find((result: any) => result.horseId === props.horseId)
})

const isSelectedHorse = computed(() => {
  return selectedHorse.value?.id === props.horseId
})

const horsePosition = computed(() => {
  const isStarted = store.getters.getIsStarted
  const roundFinished = store.getters.getRoundFinished
  
  if (!isStarted || roundFinished || !horseResult.value) return ''
  
  if (horseResult.value.isFinished) {
    return ''
  }
  
  const ongoingHorses = currentRoundResult.value
    .filter((result: any) => !result.isFinished)
    .sort((a: any, b: any) => b.distance - a.distance)
  
  const position = ongoingHorses.findIndex((result: any) => result.horseId === props.horseId) + 1
  return position > 0 ? `${position}.` : ''
})

const remainingDistance = computed(() => {
  if (!horseResult.value) return roundDistance.value
  const remaining = roundDistance.value - horseResult.value.distance
  return Math.max(0, Math.round(remaining))
})

const horseStyle = computed(() => {
  if (!horseResult.value || !lineRef.value) return {}
  
  const containerWidth = lineRef.value.offsetWidth - 60
  const position = calculateHorsePosition(horseResult.value.distance, roundDistance.value, containerWidth)
  
  return {
    transform: `translateX(${position}px)`,
    transition: props.isRunning ? 'transform 0.3s linear' : 'none'
  }
})

onMounted(() => {
  if (lineRef.value) {
    lineRef.value.style.position = 'relative'
  }
})
</script>

<style scoped>
.line {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 60px;
  border-bottom: 5px dashed #F78D60;
  position: relative;
  transition: background-color 0.3s ease;
}

.selected-line {
  background-color: rgba(25, 118, 210, 0.5);
  border-radius: 4px;
}

.position-text {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-weight: bold;
  color: #333;
  background: rgba(255, 255, 255, 0.8);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  min-width: 20px;
  text-align: center;
}

.distance-text {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-weight: bold;
  color: #333;
  background: rgba(255, 255, 255, 0.8);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}
</style>
