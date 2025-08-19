<template>
  <div class="arena">
    <div class="lines">
      <Line v-for="horse in props.horses" :key="horse.id" :colorCode="horse.colorCode" :isRunning="isRunning" :horseId="horse.id" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import Line from './line.vue'
import type { Horse } from '../model/horse'
import { useRaceSimulator } from '../store/untils'

const store = useStore()

const props = defineProps<{
  horses: Horse[]
  isStarted: boolean
}>()

const isRunning = computed(() => {
  return store.getters.getIsStarted && !store.getters.getRoundFinished
})

const { watchRaceState } = useRaceSimulator(store)

onMounted(() => {
  watchRaceState()
})
</script>

<style scoped>
.arena {
  width: 800px;
  height: 600px;
  background-image: url('/grass.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  border: 2px solid #333;
  border-right: 3px solid #F44336;
}

</style>
