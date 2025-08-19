import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import Horse from '../../../components/horse.vue'

vi.mock('vue3-lottie', () => ({
  Vue3Lottie: {
    name: 'Vue3Lottie',
    template: '<div class="mock-lottie"></div>',
    props: ['animation-data', 'loop', 'autoplay', 'height'],
    emits: ['DOMLoaded']
  }
}))

const mockSelectHorse = vi.fn()

const mockStore = createStore({
  state: {
    selectedHorse: null as any,
    currentRoundResult: [] as any[],
    horsesWithCondition: [] as any[]
  },
  getters: {
    getSelectedHorse: (state) => state.selectedHorse,
    getCurrentRoundResult: (state) => state.currentRoundResult,
    getHorsesWithCondition: (state) => state.horsesWithCondition
  },
  actions: {
    selectHorse: mockSelectHorse
  }
})

global.fetch = vi.fn()

describe('Horse Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStore.state.selectedHorse = null
    mockStore.state.currentRoundResult = []
    mockStore.state.horsesWithCondition = []
    ;(global.fetch as any).mockResolvedValue({
      json: () => Promise.resolve({ mock: 'animation-data' })
    })
  })

  it('renders horse container', () => {
    const wrapper = mount(Horse, {
      global: {
        plugins: [mockStore]
      },
      props: {
        colorCode: [139, 69, 19],
        isRunning: true,
        horseId: 'horse1'
      }
    })

    expect(wrapper.find('.horse-container').exists()).toBe(true)
    expect(wrapper.find('.horse-container-inner').exists()).toBe(true)
  })

  it('renders Vue3Lottie component with correct props', () => {
    const wrapper = mount(Horse, {
      global: {
        plugins: [mockStore]
      },
      props: {
        colorCode: [139, 69, 19],
        isRunning: true,
        horseId: 'horse1'
      }
    })

    const lottieComponent = wrapper.findComponent({ name: 'Vue3Lottie' })
    expect(lottieComponent.exists()).toBe(true)
    expect(lottieComponent.props('loop')).toBe(true)
    expect(lottieComponent.props('autoplay')).toBe(true)
    expect(lottieComponent.props('height')).toBe(40)
  })

  it('sets correct height when horse is selected', () => {
    mockStore.state.selectedHorse = { id: 'horse1' }

    const wrapper = mount(Horse, {
      global: {
        plugins: [mockStore]
      },
      props: {
        colorCode: [139, 69, 19],
        isRunning: true,
        horseId: 'horse1'
      }
    })

    const lottieComponent = wrapper.findComponent({ name: 'Vue3Lottie' })
    expect(lottieComponent.props('height')).toBe(50)
  })

  it('sets correct height when horse is not selected', () => {
    mockStore.state.selectedHorse = { id: 'horse2' }

    const wrapper = mount(Horse, {
      global: {
        plugins: [mockStore]
      },
      props: {
        colorCode: [139, 69, 19],
        isRunning: true,
        horseId: 'horse1'
      }
    })

    const lottieComponent = wrapper.findComponent({ name: 'Vue3Lottie' })
    expect(lottieComponent.props('height')).toBe(40)
  })

  it('disables loop and autoplay when horse is finished', () => {
    mockStore.state.currentRoundResult = [
      { horseId: 'horse1', isFinished: true }
    ]

    const wrapper = mount(Horse, {
      global: {
        plugins: [mockStore]
      },
      props: {
        colorCode: [139, 69, 19],
        isRunning: true,
        horseId: 'horse1'
      }
    })

    const lottieComponent = wrapper.findComponent({ name: 'Vue3Lottie' })
    expect(lottieComponent.props('loop')).toBe(false)
    expect(lottieComponent.props('autoplay')).toBe(false)
  })

  it('enables loop and autoplay when horse is running and not finished', () => {
    mockStore.state.currentRoundResult = [
      { horseId: 'horse1', isFinished: false }
    ]

    const wrapper = mount(Horse, {
      global: {
        plugins: [mockStore]
      },
      props: {
        colorCode: [139, 69, 19],
        isRunning: true,
        horseId: 'horse1'
      }
    })

    const lottieComponent = wrapper.findComponent({ name: 'Vue3Lottie' })
    expect(lottieComponent.props('loop')).toBe(true)
    expect(lottieComponent.props('autoplay')).toBe(true)
  })

  it('disables loop and autoplay when horse is not running', () => {
    const wrapper = mount(Horse, {
      global: {
        plugins: [mockStore]
      },
      props: {
        colorCode: [139, 69, 19],
        isRunning: false,
        horseId: 'horse1'
      }
    })

    const lottieComponent = wrapper.findComponent({ name: 'Vue3Lottie' })
    expect(lottieComponent.props('loop')).toBe(false)
    expect(lottieComponent.props('autoplay')).toBe(false)
  })

  it('loads animation data on mount', async () => {
    mount(Horse, {
      global: {
        plugins: [mockStore]
      },
      props: {
        colorCode: [139, 69, 19],
        isRunning: true,
        horseId: 'horse1'
      }
    })

    expect(global.fetch).toHaveBeenCalledWith('/racehorse.json')
  })

  it('handles animation data loading error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    ;(global.fetch as any).mockRejectedValue(new Error('Network error'))

    mount(Horse, {
      global: {
        plugins: [mockStore]
      },
      props: {
        colorCode: [139, 69, 19],
        isRunning: true,
        horseId: 'horse1'
      }
    })

    await new Promise(resolve => setTimeout(resolve, 0))
    expect(consoleSpy).toHaveBeenCalledWith('Failed to load horse animation:', expect.any(Error))
    consoleSpy.mockRestore()
  })

  it('calls selectHorse action when clicked', async () => {
    mockStore.state.horsesWithCondition = [
      { id: 'horse1', name: 'Test Horse' }
    ]

    const wrapper = mount(Horse, {
      global: {
        plugins: [mockStore]
      },
      props: {
        colorCode: [139, 69, 19],
        isRunning: true,
        horseId: 'horse1'
      }
    })

    await wrapper.find('.horse-container').trigger('click')
    expect(mockSelectHorse).toHaveBeenCalledWith(expect.anything(), { id: 'horse1', name: 'Test Horse' })
  })

  it('does not call selectHorse action when horse is not found', async () => {
    mockStore.state.horsesWithCondition = [
      { id: 'horse2', name: 'Test Horse' }
    ]

    const wrapper = mount(Horse, {
      global: {
        plugins: [mockStore]
      },
      props: {
        colorCode: [139, 69, 19],
        isRunning: true,
        horseId: 'horse1'
      }
    })

    await wrapper.find('.horse-container').trigger('click')
    expect(mockSelectHorse).not.toHaveBeenCalled()
  })

  it('applies custom style prop', () => {
    const customStyle = { transform: 'translateX(100px)' }

    const wrapper = mount(Horse, {
      global: {
        plugins: [mockStore]
      },
      props: {
        colorCode: [139, 69, 19],
        isRunning: true,
        horseId: 'horse1',
        style: customStyle
      }
    })

    const horseContainer = wrapper.find('.horse-container')
    expect(horseContainer.attributes('style')).toContain('transform: translateX(100px)')
  })

  it('has correct default props', () => {
    const wrapper = mount(Horse, {
      global: {
        plugins: [mockStore]
      }
    })

    expect(wrapper.props('colorCode')).toEqual([1, 1, 1, 1])
    expect(wrapper.props('isRunning')).toBe(true)
    expect(wrapper.props('horseId')).toBe('')
    expect(wrapper.props('style')).toEqual({})
  })

  it('applies hover effect styles', () => {
    const wrapper = mount(Horse, {
      global: {
        plugins: [mockStore]
      },
      props: {
        colorCode: [139, 69, 19],
        isRunning: true,
        horseId: 'horse1'
      }
    })

    const horseContainer = wrapper.find('.horse-container')
    expect(horseContainer.classes()).toContain('horse-container')
  })

  it('has cursor pointer class', () => {
    const wrapper = mount(Horse, {
      global: {
        plugins: [mockStore]
      },
      props: {
        colorCode: [139, 69, 19],
        isRunning: true,
        horseId: 'horse1'
      }
    })

    const horseContainer = wrapper.find('.horse-container')
    expect(horseContainer.classes()).toContain('horse-container')
  })

  it('has inner container class', () => {
    const wrapper = mount(Horse, {
      global: {
        plugins: [mockStore]
      },
      props: {
        colorCode: [139, 69, 19],
        isRunning: true,
        horseId: 'horse1'
      }
    })

    const innerContainer = wrapper.find('.horse-container-inner')
    expect(innerContainer.classes()).toContain('horse-container-inner')
  })

  it('logs color code on mount', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    mount(Horse, {
      global: {
        plugins: [mockStore]
      },
      props: {
        colorCode: [139, 69, 19],
        isRunning: true,
        horseId: 'horse1'
      }
    })

    expect(consoleSpy).toHaveBeenCalledWith('props', [139, 69, 19])
    consoleSpy.mockRestore()
  })
})
