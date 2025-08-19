import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import Line from '../../../components/line.vue'

vi.mock('../../../store/untils', () => ({
  calculateHorsePosition: vi.fn()
}))

vi.mock('../../../store/round-list', () => ({
  roundList: [
    { id: 1, range: 1200 },
    { id: 2, range: 1400 },
    { id: 3, range: 1600 }
  ]
}))

vi.mock('../../../components/horse.vue', () => ({
  default: {
    name: 'Horse',
    template: '<div class="mock-horse"></div>',
    props: ['colorCode', 'isRunning', 'horseId', 'style'],
    emits: []
  }
}))

const mockStore = createStore({
  state: {
    currentRound: 1,
    currentRoundResult: [] as any[],
    selectedHorse: null as any,
    isStarted: false,
    roundFinished: false
  },
  getters: {
    getCurrentRound: (state) => state.currentRound,
    getCurrentRoundResult: (state) => state.currentRoundResult,
    getSelectedHorse: (state) => state.selectedHorse,
    getIsStarted: (state) => state.isStarted,
    getRoundFinished: (state) => state.roundFinished
  }
})

describe('Line Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStore.state.currentRound = 1
    mockStore.state.currentRoundResult = []
    mockStore.state.selectedHorse = null
    mockStore.state.isStarted = false
    mockStore.state.roundFinished = false
  })

  it('renders line container', () => {
    const wrapper = mount(Line, {
      global: {
        plugins: [mockStore]
      },
      props: {
        colorCode: [139, 69, 19],
        isRunning: false,
        horseId: 'horse1'
      }
    })

    expect(wrapper.find('.line').exists()).toBe(true)
  })

  it('renders horse component with correct props', () => {
    const wrapper = mount(Line, {
      global: {
        plugins: [mockStore]
      },
      props: {
        colorCode: [139, 69, 19],
        isRunning: true,
        horseId: 'horse1'
      }
    })

    const horseComponent = wrapper.findComponent({ name: 'Horse' })
    expect(horseComponent.exists()).toBe(true)
    expect(horseComponent.props('colorCode')).toEqual([139, 69, 19])
    expect(horseComponent.props('isRunning')).toBe(true)
    expect(horseComponent.props('horseId')).toBe('horse1')
  })

  it('displays position text when horse is running and not finished', () => {
    mockStore.state.isStarted = true
    mockStore.state.roundFinished = false
    mockStore.state.currentRoundResult = [
      { horseId: 'horse1', distance: 500, isFinished: false },
      { horseId: 'horse2', distance: 600, isFinished: false }
    ]

    const wrapper = mount(Line, {
      global: {
        plugins: [mockStore]
      },
      props: {
        colorCode: [139, 69, 19],
        isRunning: true,
        horseId: 'horse1'
      }
    })

    const positionText = wrapper.find('.position-text')
    expect(positionText.exists()).toBe(true)
    expect(positionText.text()).toBe('2.')
  })

  it('hides position text when race is not started', () => {
    mockStore.state.currentRoundResult = [
      { horseId: 'horse1', distance: 500, isFinished: false }
    ]

    const wrapper = mount(Line, {
      global: {
        plugins: [mockStore]
      },
      props: {
        colorCode: [139, 69, 19],
        isRunning: false,
        horseId: 'horse1'
      }
    })

    const positionText = wrapper.find('.position-text')
    expect(positionText.text()).toBe('')
  })

  it('hides position text when horse is finished', () => {
    mockStore.state.currentRoundResult = [
      { horseId: 'horse1', distance: 1200, isFinished: true }
    ]

    const wrapper = mount(Line, {
      global: {
        plugins: [mockStore]
      },
      props: {
        colorCode: [139, 69, 19],
        isRunning: true,
        horseId: 'horse1'
      }
    })

    const positionText = wrapper.find('.position-text')
    expect(positionText.text()).toBe('')
  })

  it('displays correct remaining distance', () => {
    mockStore.state.currentRoundResult = [
      { horseId: 'horse1', distance: 500, isFinished: false }
    ]

    const wrapper = mount(Line, {
      global: {
        plugins: [mockStore]
      },
      props: {
        colorCode: [139, 69, 19],
        isRunning: true,
        horseId: 'horse1'
      }
    })

    const distanceText = wrapper.find('.distance-text')
    expect(distanceText.text()).toBe('700m')
  })

  it('displays round distance when no horse result exists', () => {
    const wrapper = mount(Line, {
      global: {
        plugins: [mockStore]
      },
      props: {
        colorCode: [139, 69, 19],
        isRunning: false,
        horseId: 'horse1'
      }
    })

    const distanceText = wrapper.find('.distance-text')
    expect(distanceText.text()).toBe('1200m')
  })

  it('displays zero distance when horse has finished', () => {
    mockStore.state.currentRoundResult = [
      { horseId: 'horse1', distance: 1200, isFinished: true }
    ]

    const wrapper = mount(Line, {
      global: {
        plugins: [mockStore]
      },
      props: {
        colorCode: [139, 69, 19],
        isRunning: true,
        horseId: 'horse1'
      }
    })

    const distanceText = wrapper.find('.distance-text')
    expect(distanceText.text()).toBe('0m')
  })

  it('applies selected line styling when horse is selected', () => {
    mockStore.state.selectedHorse = { id: 'horse1' }

    const wrapper = mount(Line, {
      global: {
        plugins: [mockStore]
      },
      props: {
        colorCode: [139, 69, 19],
        isRunning: false,
        horseId: 'horse1'
      }
    })

    expect(wrapper.find('.line').classes()).toContain('selected-line')
  })

  it('does not apply selected line styling when horse is not selected', () => {
    mockStore.state.selectedHorse = { id: 'horse2' }

    const wrapper = mount(Line, {
      global: {
        plugins: [mockStore]
      },
      props: {
        colorCode: [139, 69, 19],
        isRunning: false,
        horseId: 'horse1'
      }
    })

    expect(wrapper.find('.line').classes()).not.toContain('selected-line')
  })

  it('calculates position correctly for multiple horses', () => {
    mockStore.state.isStarted = true
    mockStore.state.roundFinished = false
    mockStore.state.currentRoundResult = [
      { horseId: 'horse1', distance: 800, isFinished: false },
      { horseId: 'horse2', distance: 900, isFinished: false },
      { horseId: 'horse3', distance: 700, isFinished: false }
    ]

    const wrapper = mount(Line, {
      global: {
        plugins: [mockStore]
      },
      props: {
        colorCode: [139, 69, 19],
        isRunning: true,
        horseId: 'horse1'
      }
    })

    const positionText = wrapper.find('.position-text')
    expect(positionText.text()).toBe('2.')
  })

  it('handles different round distances correctly', () => {
    mockStore.state.currentRound = 2
    mockStore.state.currentRoundResult = [
      { horseId: 'horse1', distance: 500, isFinished: false }
    ]

    const wrapper = mount(Line, {
      global: {
        plugins: [mockStore]
      },
      props: {
        colorCode: [139, 69, 19],
        isRunning: true,
        horseId: 'horse1'
      }
    })

    const distanceText = wrapper.find('.distance-text')
    expect(distanceText.text()).toBe('900m')
  })

  it('sets line container position to relative on mount', () => {
    const wrapper = mount(Line, {
      global: {
        plugins: [mockStore]
      },
      props: {
        colorCode: [139, 69, 19],
        isRunning: false,
        horseId: 'horse1'
      }
    })

    const lineElement = wrapper.find('.line').element as HTMLElement
    expect(lineElement.style.position).toBe('relative')
  })
})
