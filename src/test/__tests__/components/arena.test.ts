import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import Arena from '../../../components/arena.vue'

const mockWatchRaceState = vi.fn()

vi.mock('../../store/untils', () => ({
  useRaceSimulator: vi.fn(() => ({
    watchRaceState: mockWatchRaceState
  }))
}))

vi.mock('vue3-lottie', () => ({
  Vue3Lottie: {
    name: 'Vue3Lottie',
    template: '<div class="mock-lottie"></div>',
    props: ['animation-data', 'loop', 'autoplay', 'height'],
    emits: ['DOMLoaded']
  }
}))

const mockStore = createStore({
  state: {
    isStarted: false,
    roundFinished: false,
    currentRound: 1,
    result: {} as { [key: number]: any[] },
    horsesWithCondition: [],
    speed: 100
  },
  getters: {
    getIsStarted: (state) => state.isStarted,
    getRoundFinished: (state) => state.roundFinished,
    getCurrentRound: (state) => state.currentRound,
    getCurrentRoundResult: (state) => state.result[state.currentRound] || [],
    getHorsesWithCondition: (state) => state.horsesWithCondition,
    getSpeed: (state) => state.speed
  },
  mutations: {
    UPDATE_HORSE_DISTANCE: vi.fn(),
    SET_HORSE_FINISHED: vi.fn(),
    FINISH_ROUND: vi.fn(),
    NEXT_ROUND: vi.fn(),
    INITIALIZE_ROUND_RESULT: vi.fn()
  }
})

describe('Arena Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStore.state.isStarted = false
    mockStore.state.roundFinished = false
  })

  it('renders arena container', () => {
    const wrapper = mount(Arena, {
      global: {
        plugins: [mockStore]
      },
      props: {
        horses: [
          { id: 'horse1', name: 'Test Horse 1', color: 'Brown', colorCode: [139, 69, 19] },
          { id: 'horse2', name: 'Test Horse 2', color: 'Black', colorCode: [0, 0, 0] }
        ],
        isStarted: false
      }
    })

    expect(wrapper.find('.arena').exists()).toBe(true)
    expect(wrapper.find('.lines').exists()).toBe(true)
  })

  it('renders line components for each horse', () => {
    const horses = [
      { id: 'horse1', name: 'Test Horse 1', color: 'Brown', colorCode: [139, 69, 19] },
      { id: 'horse2', name: 'Test Horse 2', color: 'Black', colorCode: [0, 0, 0] },
      { id: 'horse3', name: 'Test Horse 3', color: 'White', colorCode: [255, 255, 255] }
    ]

    const wrapper = mount(Arena, {
      global: {
        plugins: [mockStore]
      },
      props: {
        horses,
        isStarted: false
      }
    })

    const lineComponents = wrapper.findAllComponents({ name: 'Line' })
    expect(lineComponents).toHaveLength(3)
  })

  it('passes correct props to line components', () => {
    const horses = [
      { id: 'horse1', name: 'Test Horse 1', color: 'Brown', colorCode: [139, 69, 19] },
      { id: 'horse2', name: 'Test Horse 2', color: 'Black', colorCode: [0, 0, 0] }
    ]

    const wrapper = mount(Arena, {
      global: {
        plugins: [mockStore]
      },
      props: {
        horses,
        isStarted: true
      }
    })

    const lineComponents = wrapper.findAllComponents({ name: 'Line' })
    
    expect(lineComponents[0].props('horseId')).toBe('horse1')
    expect(lineComponents[0].props('colorCode')).toEqual([139, 69, 19])
    expect(lineComponents[0].props('isRunning')).toBe(false)
    
    expect(lineComponents[1].props('horseId')).toBe('horse2')
    expect(lineComponents[1].props('colorCode')).toEqual([0, 0, 0])
    expect(lineComponents[1].props('isRunning')).toBe(false)
  })

  it('computes isRunning correctly when race is started', () => {
    mockStore.state.isStarted = true
    mockStore.state.roundFinished = false

    const wrapper = mount(Arena, {
      global: {
        plugins: [mockStore]
      },
      props: {
        horses: [
          { id: 'horse1', name: 'Test Horse 1', color: 'Brown', colorCode: [139, 69, 19] }
        ],
        isStarted: true
      }
    })

    expect((wrapper.vm as any).isRunning).toBe(true)
  })

  it('computes isRunning correctly when race is finished', () => {
    mockStore.state.isStarted = true
    mockStore.state.roundFinished = true

    const wrapper = mount(Arena, {
      global: {
        plugins: [mockStore]
      },
      props: {
        horses: [
          { id: 'horse1', name: 'Test Horse 1', color: 'Brown', colorCode: [139, 69, 19] }
        ],
        isStarted: true
      }
    })

    expect((wrapper.vm as any).isRunning).toBe(false)
  })

  it('computes isRunning correctly when race is not started', () => {
    mockStore.state.isStarted = false
    mockStore.state.roundFinished = false

    const wrapper = mount(Arena, {
      global: {
        plugins: [mockStore]
      },
      props: {
        horses: [
          { id: 'horse1', name: 'Test Horse 1', color: 'Brown', colorCode: [139, 69, 19] }
        ],
        isStarted: false
      }
    })

    expect((wrapper.vm as any).isRunning).toBe(false)
  })
})
