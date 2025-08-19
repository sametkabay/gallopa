import { createStore } from 'vuex'
import { horseList } from './horse-list'
import { roundList } from './round-list'
import type { Horse, HorseWithCondition } from '../model/horse'

interface State {
  isStarted: boolean
  currentRound: number
  roundHorses: { [roundId: number]: Horse[] }
  horsesWithCondition: HorseWithCondition[]
  selectedHorse: HorseWithCondition | null
}

const state: State = {
  isStarted: false,
  currentRound: 1,
  roundHorses: {},
  horsesWithCondition: [],
  selectedHorse: null
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
    getSelectedHorse: (state: State) => state.selectedHorse
  },
  mutations: {
    SET_SELECTED_HORSE(state: State, horse: HorseWithCondition | null) {
      state.selectedHorse = horse
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
    START_RACE(state: State) {
      state.isStarted = true
    },
    PAUSE_RACE(state: State) {
      state.isStarted = false
    },
    RESET_RACE(state: State) {
      state.isStarted = false
      state.roundHorses = {}
      state.currentRound = 1
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
    initializeRoundHorses({ commit }: any) {
      commit('INITIALIZE_HORSES_WITH_CONDITION')
      commit('INITIALIZE_ROUND_HORSES')
    },
    startPauseRace({ commit }: any) {
      if (state.isStarted) {
        commit('PAUSE_RACE')
      } else {
        commit('START_RACE')
      }
    },

    resetRace({ commit }: any) {
      commit('RESET_RACE')
    }
  },
  modules: {}
})
