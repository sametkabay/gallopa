import type { HorseWithCondition } from '../model/horse'
import { roundList } from './round-list'
import { watch, onUnmounted } from 'vue'

export interface HorseResult {
  horseId: string
  distance: number
  isFinished: boolean
  position: number
}

export const calculateHorseMovement = (horse: HorseWithCondition): number => {
  const randomMovement = Math.floor(Math.random() * 7) + 1
  const conditionMovement = Math.floor((horse.condition / 100) * 3) + 1
  return randomMovement + conditionMovement
}

export const updateHorseDistances = (
  currentResults: HorseResult[],
  horsesWithCondition: HorseWithCondition[],
  roundId: number
): { updatedResults: HorseResult[], finishedHorses: string[] } => {
  const updatedResults = [...currentResults]
  const finishedHorses: string[] = []
  let nextPosition = 1

  const roundDistance = roundList.find(round => round.id === roundId)?.range || 1200

  updatedResults.forEach(result => {
    if (!result.isFinished) {
      const horse = horsesWithCondition.find(h => h.id === result.horseId)
      if (horse) {
        const movement = calculateHorseMovement(horse)
        const newDistance = result.distance + movement

        if (newDistance >= roundDistance) {
          result.distance = roundDistance
          result.isFinished = true
          result.position = nextPosition
          finishedHorses.push(result.horseId)
          nextPosition++
        } else {
          result.distance = newDistance
        }
      }
    }
  })

  return { updatedResults, finishedHorses }
}

export const checkRoundFinished = (results: HorseResult[]): boolean => {
  return results.every(result => result.isFinished)
}

export const calculateHorsePosition = (distance: number, totalDistance: number, containerWidth: number): number => {
  const progress = distance / totalDistance
  return progress * containerWidth
}

export const useRaceSimulator = (store: any) => {
  let raceInterval: number | null = null

  const startRaceSimulation = () => {
    if (raceInterval !== null) return

    raceInterval = window.setInterval(() => {
      const isStarted = store.getters.getIsStarted
      const roundFinished = store.getters.getRoundFinished
      const currentRound = store.getters.getCurrentRound

      if (!isStarted || roundFinished) return

      const currentResults = store.getters.getCurrentRoundResult
      const horsesWithCondition = store.getters.getHorsesWithCondition

      const { updatedResults } = updateHorseDistances(
        currentResults,
        horsesWithCondition,
        currentRound
      )

      updatedResults.forEach(result => {
        store.commit('UPDATE_HORSE_DISTANCE', {
          roundId: currentRound,
          horseId: result.horseId,
          distance: result.distance
        })

        if (result.isFinished) {
          store.commit('SET_HORSE_FINISHED', {
            roundId: currentRound,
            horseId: result.horseId,
            position: result.position
          })
        }
      })

      if (checkRoundFinished(updatedResults)) {
        store.commit('FINISH_ROUND')
        
        if (currentRound < roundList.length) {
          store.commit('NEXT_ROUND')
          store.commit('INITIALIZE_ROUND_RESULT', currentRound + 1)
        }
      }
    }, store.getters.getSpeed)
  }

  const stopRaceSimulation = () => {
    if (raceInterval) {
      clearInterval(raceInterval)
      raceInterval = null
    }
  }

  const watchRaceState = () => {
    watch(
      () => [store.getters.getIsStarted, store.getters.getCurrentRound],
      ([isStarted]) => {
        if (isStarted) {
          startRaceSimulation()
        } else {
          stopRaceSimulation()
        }
      },
      { immediate: true }
    )
  }

  onUnmounted(() => {
    stopRaceSimulation()
  })

  return {
    startRaceSimulation,
    stopRaceSimulation,
    watchRaceState
  }
}
