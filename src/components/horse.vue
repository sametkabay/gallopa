<template>
  <div class="horse-container">
    <Vue3Lottie
      :animation-data="modifiedAnimationData"
      :loop="isRunning"
      :autoplay="isRunning"
      :height="horseHeight"
      @DOMLoaded="onAnimationLoaded"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { Vue3Lottie } from 'vue3-lottie'
import { useStore } from 'vuex'

interface Props {
  colorCode?: number[]
  isRunning?: boolean
  horseId?: string
}

interface LottieInstance {
  updateDocumentData: (data: any) => void
  play: () => void
  pause: () => void
}

const store = useStore()

const props = withDefaults(defineProps<Props>(), {
  colorCode: () => [1, 1, 1, 1],
  isRunning: true,
  horseId: ''
})

const originalAnimationData = ref<any | null>(null)
const lottieInstance = ref<LottieInstance | null>(null)

const selectedHorse = computed(() => store.getters.getSelectedHorse)
const horseHeight = computed(() => {
  return selectedHorse.value?.id === props.horseId ? 50 : 40
})

const modifiedAnimationData = computed(() => {
  if (!originalAnimationData.value) return null

  const data = JSON.parse(JSON.stringify(originalAnimationData.value))
  
  const normalizedColor = props.colorCode.map(color => color / 255)
  
  const updateColors = (obj: any) => {
    if (typeof obj !== 'object' || obj === null) return obj
    
    if (obj.c && Array.isArray(obj.c.k) && obj.c.k.length === 4) {
      obj.c.k = normalizedColor
    }
    
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        updateColors(obj[key])
      }
    }
  }
  
  updateColors(data)
  return data
})

const onAnimationLoaded = (instance: LottieInstance) => {
  lottieInstance.value = instance
}

const loadAnimationData = async () => {
  try {
    const response = await fetch('/racehorse.json')
    const data = await response.json()
    originalAnimationData.value = data
  } catch (error) {
    console.error('Failed to load horse animation:', error)
  }
}

watch(() => props.isRunning, (newValue) => {
  if (lottieInstance.value) {
    if (newValue) {
      lottieInstance.value.play()
    } else {
      lottieInstance.value.pause()
    }
  }
})

watch(() => props.colorCode, () => {
  if (lottieInstance.value && modifiedAnimationData.value) {
    lottieInstance.value.updateDocumentData(modifiedAnimationData.value)
  }
})

onMounted(() => {
  loadAnimationData()
  console.log('props', props.colorCode)
})
</script>

<style scoped>
.horse-container {
  display: flex;
  justify-content: center;
  align-items: center;
  transform: scaleX(-1);
}
</style>
