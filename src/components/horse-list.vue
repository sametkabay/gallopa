<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import type { HorseWithCondition } from '../model/horse'

const store = useStore()

const horsesWithCondition = computed(() => store.getters.getHorsesWithCondition)
const selectedHorse = computed(() => store.getters.getSelectedHorse)

const selectHorse = (horse: HorseWithCondition) => {
  if (selectedHorse.value?.id === horse.id) {
    store.dispatch('selectHorse', null)
  } else {
    store.dispatch('selectHorse', horse)
  }
}
</script>

<template>
  <v-card class="horse-list-container" elevation="2">
    <v-card-title class="d-flex align-center">
      <v-icon class="mr-2">mdi-horse</v-icon>
      Horse List / Condition
    </v-card-title>
    
    <v-card-text>
      <v-list class="horse-list">
        <v-list-item
          v-for="horse in horsesWithCondition"
          :key="horse.id"
          :class="{ 'selected-horse': selectedHorse?.id === horse.id }"
          @click="selectHorse(horse)"
          class="horse-item"
        >
          <template v-slot:prepend>
            <v-avatar
              :style="{ backgroundColor: `rgb(${horse.colorCode.join(',')})` }"
              size="40"
            >
              <v-icon color="white">mdi-horse</v-icon>
            </v-avatar>
          </template>
          
          <v-list-item-title class="horse-name">
            {{ horse.name }}
          </v-list-item-title>
          
          <v-list-item-subtitle class="horse-color">
            {{ horse.color }}
          </v-list-item-subtitle>

          <template v-slot:append>
            <v-chip
              :color="getConditionColor(horse.condition)"
              size="small"
              class="condition-chip"
            >
              {{ horse.condition }}
            </v-chip>
          </template>

        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
const getConditionColor = (condition: number): string => {
  if (condition >= 80) return 'success'
  if (condition >= 60) return 'warning'
  if (condition >= 40) return 'info'
  return 'error'
}
</script>

<style scoped>
.horse-list-container {
  width: 350px;
  height: 600px;
  overflow: hidden;
}

.horse-list {
  max-height: 600px;
  overflow-y: auto;
}

.horse-item {
  border-radius: 8px;
  margin-bottom: 4px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.horse-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.1);
  transform: translateX(4px);
}

.selected-horse {
  background-color: rgba(var(--v-theme-primary), 0.15);
  border-left: 4px solid rgb(var(--v-theme-primary));
}

.horse-name {
  font-weight: 600;
  font-size: 1rem;
}

.horse-color {
  font-size: 0.875rem;
  opacity: 0.7;
}

.condition-chip {
  font-weight: 600;
  min-width: 40px;
  justify-content: center;
}
</style>
