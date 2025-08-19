<template>
  <div class="arena">
    <div class="lines">
      <Line v-for="horse in props.horses" :key="horse.id" :colorCode="horse.colorCode" :isRunning="props.isStarted" :horseId="horse.id" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Line from './line.vue'
import type { Horse } from '../model/horse'

const props = defineProps<{
  horses: Horse[]
  isStarted: boolean
}>()

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
