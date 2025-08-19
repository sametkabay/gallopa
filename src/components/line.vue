<template>
  <div class="line">
    <Horse :colorCode="props.colorCode" :isRunning="props.isRunning" :horseId="props.horseId" />
  </div>
</template>

<script setup lang="ts">
import Horse from './horse.vue'

const props = defineProps<{
  colorCode: number[]
  isRunning: boolean
  horseId: string
}>()
</script>

<style scoped>
.line {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 60px;
  border-bottom: 5px dashed #F78D60;
}
</style>
