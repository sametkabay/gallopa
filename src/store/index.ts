import { createStore } from 'vuex'
import { horseList } from './horse-list'
import { roundList } from './round-list'
import { SpeedType } from '../model/speed'
import type { Horse, HorseWithCondition } from '../model/horse'

interface HorseResult {
  horseId: string
  distance: number
  isFinished: boolean
  position: number
}

interface State {
  isStarted: boolean
  currentRound: number
  roundHorses: { [roundId: number]: Horse[] }
  horsesWithCondition: HorseWithCondition[]
  selectedHorse: HorseWithCondition | null
  result: { [roundId: number]: HorseResult[] }
  roundFinished: boolean
  finishedOrder: { [roundId: number]: string[] }
  speed: number
}

const state: State = {
  isStarted: false,
  currentRound: 1,
  roundHorses: {},
  horsesWithCondition: [],
  selectedHorse: null,
  result: {},
  roundFinished: false,
  finishedOrder: {},
  speed: SpeedType.MEDIUM
}

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const generateRandomCondition = (): number => {
  return Math.floor(Math.random() * 100) + 1
}

export default createStore({
  state,
  getters: {
    getRoundHorses: (state: State) => (roundId: number) => state.roundHorses[roundId] || [],
    getHorsesWithCondition: (state: State) => state.horsesWithCondition,
    getSelectedHorse: (state: State) => state.selectedHorse,
    getCurrentRoundResult: (state: State) => state.result[state.currentRound] || [],
    getCurrentRound: (state: State) => state.currentRound,
    getIsStarted: (state: State) => state.isStarted,
    getRoundFinished: (state: State) => state.roundFinished,
    getFinishedOrder: (state: State) => (roundId: number) => state.finishedOrder[roundId] || [],
    getSpeed: (state: State) => state.speed
  },
  mutations: {
    SET_SELECTED_HORSE(state: State, horse: HorseWithCondition | null) {
      state.selectedHorse = horse
    },
    SET_SPEED(state: State, speed: number) {
      state.speed = speed
    },
    INITIALIZE_HORSES_WITH_CONDITION(state: State) {
      state.horsesWithCondition = horseList.map(horse => ({
        ...horse,
        condition: generateRandomCondition()
      }))
    },
    INITIALIZE_ROUND_HORSES(state: State) {
      roundList.forEach(round => {
        const shuffledHorses = shuffleArray(horseList)
        state.roundHorses[round.id] = shuffledHorses.slice(0, 10)
      })
    },
    INITIALIZE_ROUND_RESULT(state: State, roundId: number) {
      const horses = state.roundHorses[roundId] || []
      state.result[roundId] = horses.map(horse => ({
        horseId: horse.id,
        distance: 0,
        isFinished: false,
        position: 0
      }))
      state.finishedOrder[roundId] = []
    },
    UPDATE_HORSE_DISTANCE(state: State, payload: { roundId: number, horseId: string, distance: number }) {
      const roundResult = state.result[payload.roundId]
      if (roundResult) {
        const horseResult = roundResult.find(r => r.horseId === payload.horseId)
        if (horseResult) {
          horseResult.distance = payload.distance
        }
      }
    },
    SET_HORSE_FINISHED(state: State, payload: { roundId: number, horseId: string, position: number }) {
      const roundResult = state.result[payload.roundId]
      if (roundResult) {
        const horseResult = roundResult.find(r => r.horseId === payload.horseId)
        if (horseResult) {
          horseResult.isFinished = true
          horseResult.position = payload.position
        }
      }
      
      if (!state.finishedOrder[payload.roundId]) {
        state.finishedOrder[payload.roundId] = []
      }
      
      if (!state.finishedOrder[payload.roundId].includes(payload.horseId)) {
        state.finishedOrder[payload.roundId].push(payload.horseId)
      }
    },
    START_RACE(state: State) {
      state.isStarted = true
      state.roundFinished = false
    },
    PAUSE_RACE(state: State) {
      state.isStarted = false
    },
    FINISH_ROUND(state: State) {
      state.roundFinished = true
      state.isStarted = false
    },
    NEXT_ROUND(state: State) {
      state.currentRound++
      state.roundFinished = false
      state.isStarted = false
    },
    RESET_RACE(state: State) {
      state.isStarted = false
      state.roundFinished = false
      state.currentRound = 1
      state.roundHorses = {}
      state.result = {}
      state.finishedOrder = {}
      state.selectedHorse = null
      state.horsesWithCondition = horseList.map(horse => ({
        ...horse,
        condition: generateRandomCondition()
      }))
      roundList.forEach(round => {
        const shuffledHorses = shuffleArray(horseList)
        state.roundHorses[round.id] = shuffledHorses.slice(0, 10)
      })
    }
  },
  actions: {
    selectHorse({ commit }: any, horse: HorseWithCondition | null) {
      commit('SET_SELECTED_HORSE', horse)
    },
    setSpeed({ commit }: any, speed: number) {
      commit('SET_SPEED', speed)
    },
    initializeRoundHorses({ commit }: any) {
      commit('INITIALIZE_HORSES_WITH_CONDITION')
      commit('INITIALIZE_ROUND_HORSES')
      commit('INITIALIZE_ROUND_RESULT', 1)
    },
    startPauseRace({ commit, state }: any) {
      if (state.isStarted) {
        commit('PAUSE_RACE')
      } else {
        commit('START_RACE')
      }
    },
    resetRace({ commit }: any) {
      commit('RESET_RACE')
      commit('INITIALIZE_ROUND_RESULT', 1)
    },
    nextRound({ commit, state }: any) {
      commit('NEXT_ROUND')
      if (state.currentRound <= roundList.length) {
        commit('INITIALIZE_ROUND_RESULT', state.currentRound)
      }
    }
  },
  modules: {}
})
