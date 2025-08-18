import { createStore } from 'vuex'

interface State {
  count: number
  user: {
    name: string
    email: string
  }
}

const state: State = {
  count: 0,
  user: {
    name: '',
    email: ''
  }
}

export default createStore({
  state,
  getters: {
    getCount: (state: State) => state.count,
    getUser: (state: State) => state.user,
    isLoggedIn: (state: State) => !!state.user.name
  },
  mutations: {
    INCREMENT(state: State) {
      state.count++
    },
    DECREMENT(state: State) {
      state.count--
    },
    SET_COUNT(state: State, payload: number) {
      state.count = payload
    },
    SET_USER(state: State, payload: { name: string; email: string }) {
      state.user = payload
    },
    CLEAR_USER(state: State) {
      state.user = { name: '', email: '' }
    }
  },
  actions: {
    increment({ commit }: any) {
      commit('INCREMENT')
    },
    decrement({ commit }: any) {
      commit('DECREMENT')
    },
    setCount({ commit }: any, payload: number) {
      commit('SET_COUNT', payload)
    },
    setUser({ commit }: any, payload: { name: string; email: string }) {
      commit('SET_USER', payload)
    },
    clearUser({ commit }: any) {
      commit('CLEAR_USER')
    },
    async loginUser({ commit }: any, credentials: { name: string; email: string }) {
      try {
        commit('SET_USER', credentials)
        return Promise.resolve()
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },
  modules: {}
})
