<script setup lang="ts">
import Arena from './components/arena.vue'
import HorseList from './components/horse-list.vue'
import RoundList from './components/round-list.vue'
import { useStore } from 'vuex'
import { computed } from 'vue'
import { SpeedType } from './model/speed'

const store = useStore()

const getRoundHorses = (roundId: number) => {
  return store.getters.getRoundHorses(roundId)
}

const currentSpeed = computed(() => store.getters.getSpeed)

const setSpeed = (speed: number) => {
  store.dispatch('setSpeed', speed)
}
</script>

<template>
  <div class="app">
    <div class="horse-list">
      <HorseList />
    </div>
    <div class="arena-wrapper">
      <Arena :horses="getRoundHorses(store.state.currentRound)" :isStarted="store.state.isStarted" />
      <div class="actions">
        <v-btn 
          v-if="store.state.currentRound <= 6 && !store.state.roundFinished" 
          variant="tonal" 
          @click="store.dispatch('startPauseRace')"
        >
          {{ store.state.isStarted ? 'Pause' : 'Start Round ' + store.state.currentRound }}
        </v-btn>
        <v-btn variant="tonal" @click="store.dispatch('resetRace')">Reset</v-btn>
      </div>
      <div class="speed-controls">
        <v-btn 
          variant="tonal" 
          :color="currentSpeed === SpeedType.MEDIUM ? 'primary' : undefined"
          :disabled="store.state.isStarted"
          @click="setSpeed(SpeedType.MEDIUM)"
        >
          Medium
        </v-btn>
        <v-btn 
          variant="tonal" 
          :color="currentSpeed === SpeedType.FAST ? 'primary' : undefined"
          :disabled="store.state.isStarted"
          @click="setSpeed(SpeedType.FAST)"
        >
          Fast
        </v-btn>
        <v-btn 
          variant="tonal" 
          :color="currentSpeed === SpeedType.VERY_FAST ? 'primary' : undefined"
          :disabled="store.state.isStarted"
          @click="setSpeed(SpeedType.VERY_FAST)"
        >
          Very Fast
        </v-btn>
      </div>
    </div>
    <div class="round-list">
      <RoundList />
    </div>
  </div>
  </template>

<style scoped>
  .app {
    display: flex;
    justify-content: center;
    width: 100%;
    gap: 32px;

    .arena-wrapper {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .actions {
        display: flex;
        gap: 16px;
        justify-content: center;
      }

      .speed-controls {
        display: flex;
        gap: 8px;
        justify-content: center;
      }
    }
  }
</style>
