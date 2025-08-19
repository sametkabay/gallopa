<script setup lang="ts">
import Arena from './components/arena.vue'
import HorseList from './components/horse-list.vue'
import RoundList from './components/round-list.vue'
import { useStore } from 'vuex'

const store = useStore()

const getRoundHorses = (roundId: number) => {
  return store.getters.getRoundHorses(roundId)
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
        <v-btn variant="tonal" @click="store.dispatch('startPauseRace')">{{ store.state.isStarted ? 'Pause' : 'Start Round ' + store.state.currentRound }}</v-btn>
        <v-btn variant="tonal" @click="store.dispatch('resetRace')">Reset</v-btn>
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
    }
  }
</style>
