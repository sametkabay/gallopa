import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import RoundList from '../../../components/round-list.vue'

vi.mock('../../../store/round-list', () => ({
  roundList: [
    { id: 1, name: 'Round 1', range: 1200 },
    { id: 2, name: 'Round 2', range: 1400 },
    { id: 3, name: 'Round 3', range: 1600 }
  ]
}))

const mockGetRoundHorses = vi.fn()
const mockGetFinishedOrder = vi.fn()
const mockInitializeRoundHorses = vi.fn()

const mockStore = createStore({
  state: {
    selectedHorse: null as any,
    result: {} as { [key: number]: any[] }
  },
  getters: {
    getSelectedHorse: (state) => state.selectedHorse,
    getRoundHorses: () => (roundId: number) => mockGetRoundHorses(roundId),
    getFinishedOrder: () => (roundId: number) => mockGetFinishedOrder(roundId)
  },
  actions: {
    initializeRoundHorses: mockInitializeRoundHorses
  }
})

describe('RoundList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStore.state.selectedHorse = null
    mockStore.state.result = {}
    mockGetRoundHorses.mockReturnValue([])
    mockGetFinishedOrder.mockReturnValue([])
  })

  it('renders round list container', () => {
    const wrapper = mount(RoundList, {
      global: {
        plugins: [mockStore]
      }
    })

    expect(wrapper.find('.round-list').exists()).toBe(true)
    expect(wrapper.find('.rounds-container').exists()).toBe(true)
  })

  it('renders all round sections', () => {
    const wrapper = mount(RoundList, {
      global: {
        plugins: [mockStore]
      }
    })

    const roundSections = wrapper.findAll('.round-section')
    expect(roundSections).toHaveLength(3)
  })

  it('displays correct round information', () => {
    const wrapper = mount(RoundList, {
      global: {
        plugins: [mockStore]
      }
    })

    const roundTitles = wrapper.findAll('h3')
    expect(roundTitles[0].text()).toBe('Round 1 (1200m)')
    expect(roundTitles[1].text()).toBe('Round 2 (1400m)')
    expect(roundTitles[2].text()).toBe('Round 3 (1600m)')
  })

  it('renders participants and results sections for each round', () => {
    const wrapper = mount(RoundList, {
      global: {
        plugins: [mockStore]
      }
    })

    const participantsLists = wrapper.findAll('.participants-list')
    const resultsLists = wrapper.findAll('.results-list')
    
    expect(participantsLists).toHaveLength(3)
    expect(resultsLists).toHaveLength(3)
  })

  it('displays participants list with horses', () => {
    const mockHorses = [
      { id: 'horse1', name: 'Test Horse 1' },
      { id: 'horse2', name: 'Test Horse 2' }
    ]
    mockGetRoundHorses.mockReturnValue(mockHorses)

    const wrapper = mount(RoundList, {
      global: {
        plugins: [mockStore]
      }
    })

    const participantsList = wrapper.find('.participants-list ul')
    const listItems = participantsList.findAll('li')
    expect(listItems).toHaveLength(2)
    expect(listItems[0].text()).toBe('Test Horse 1')
    expect(listItems[1].text()).toBe('Test Horse 2')
  })

  it('applies selected horse styling', () => {
    const mockHorses = [
      { id: 'horse1', name: 'Test Horse 1' },
      { id: 'horse2', name: 'Test Horse 2' }
    ]
    mockStore.state.selectedHorse = { id: 'horse1' }
    mockGetRoundHorses.mockReturnValue(mockHorses)

    const wrapper = mount(RoundList, {
      global: {
        plugins: [mockStore]
      }
    })

    const listItems = wrapper.findAll('.participants-list li')
    expect(listItems[0].classes()).toContain('selected-horse')
    expect(listItems[1].classes()).not.toContain('selected-horse')
  })

  it('displays results list with placeholders', () => {
    const wrapper = mount(RoundList, {
      global: {
        plugins: [mockStore]
      }
    })

    const resultsList = wrapper.find('.results-list ul')
    const resultItems = resultsList.findAll('.result-item')
    expect(resultItems).toHaveLength(10)

    const placeholders = resultsList.findAll('.result-placeholder')
    expect(placeholders).toHaveLength(10)
    expect(placeholders[0].text()).toBe('Place 1')
    expect(placeholders[9].text()).toBe('Place 10')
  })

  it('displays finished horses in results', () => {
    const mockHorses = [
      { id: 'horse1', name: 'Winner Horse' },
      { id: 'horse2', name: 'Second Horse' }
    ]
    mockGetRoundHorses.mockReturnValue(mockHorses)
    mockGetFinishedOrder.mockReturnValue(['horse1', 'horse2'])
    mockStore.state.result = {
      1: [
        { horseId: 'horse1', isFinished: true },
        { horseId: 'horse2', isFinished: true }
      ]
    }

    const wrapper = mount(RoundList, {
      global: {
        plugins: [mockStore]
      }
    })

    const completedResults = wrapper.findAll('.result-completed')
    expect(completedResults).toHaveLength(6)
    expect(completedResults[0].text()).toBe('1. Winner Horse')
    expect(completedResults[1].text()).toBe('2. Second Horse')
  })

  it('displays ongoing horses in results', () => {
    const mockHorses = [
      { id: 'horse1', name: 'Running Horse' },
      { id: 'horse2', name: 'Another Horse' }
    ]
    mockGetRoundHorses.mockReturnValue(mockHorses)
    mockGetFinishedOrder.mockReturnValue([])
    mockStore.state.result = {
      1: [
        { horseId: 'horse1', distance: 500, isFinished: false },
        { horseId: 'horse2', distance: 400, isFinished: false }
      ]
    }

    const wrapper = mount(RoundList, {
      global: {
        plugins: [mockStore]
      }
    })

    const ongoingResults = wrapper.findAll('.result-ongoing')
    expect(ongoingResults).toHaveLength(2)
    expect(ongoingResults[0].text()).toBe('1. Running Horse')
    expect(ongoingResults[1].text()).toBe('2. Another Horse')
  })

  it('displays mixed finished and ongoing horses', () => {
    const mockHorses = [
      { id: 'horse1', name: 'Finished Horse' },
      { id: 'horse2', name: 'Running Horse' },
      { id: 'horse3', name: 'Another Running Horse' }
    ]
    mockGetRoundHorses.mockReturnValue(mockHorses)
    mockGetFinishedOrder.mockReturnValue(['horse1'])
    mockStore.state.result = {
      1: [
        { horseId: 'horse1', isFinished: true },
        { horseId: 'horse2', distance: 500, isFinished: false },
        { horseId: 'horse3', distance: 400, isFinished: false }
      ]
    }

    const wrapper = mount(RoundList, {
      global: {
        plugins: [mockStore]
      }
    })

    const completedResults = wrapper.findAll('.result-completed')
    const ongoingResults = wrapper.findAll('.result-ongoing')
    
    expect(completedResults).toHaveLength(3)
    expect(ongoingResults).toHaveLength(2)
    expect(completedResults[0].text()).toBe('1. Finished Horse')
    expect(ongoingResults[0].text()).toBe('2. Running Horse')
    expect(ongoingResults[1].text()).toBe('3. Another Running Horse')
  })

  it('handles unknown horses gracefully', () => {
    const mockHorses = [
      { id: 'horse1', name: 'Known Horse' }
    ]
    mockGetRoundHorses.mockReturnValue(mockHorses)
    mockGetFinishedOrder.mockReturnValue(['horse1', 'unknown-horse'])
    mockStore.state.result = {
      1: [
        { horseId: 'horse1', isFinished: true },
        { horseId: 'unknown-horse', isFinished: true }
      ]
    }

    const wrapper = mount(RoundList, {
      global: {
        plugins: [mockStore]
      }
    })

    const completedResults = wrapper.findAll('.result-completed')
    expect(completedResults[0].text()).toBe('1. Known Horse')
    expect(completedResults[1].text()).toBe('2. Unknown')
  })

  it('calls initializeRoundHorses action on mount', () => {
    mount(RoundList, {
      global: {
        plugins: [mockStore]
      }
    })

    expect(mockInitializeRoundHorses).toHaveBeenCalled()
  })

  it('applies correct styling classes', () => {
    const wrapper = mount(RoundList, {
      global: {
        plugins: [mockStore]
      }
    })

    expect(wrapper.find('.round-list').classes()).toContain('round-list')
    expect(wrapper.find('.rounds-container').classes()).toContain('rounds-container')
    expect(wrapper.find('.round-section').classes()).toContain('round-section')
  })

  it('renders section headers correctly', () => {
    const wrapper = mount(RoundList, {
      global: {
        plugins: [mockStore]
      }
    })

    const participantsHeaders = wrapper.findAll('.participants-list h4')
    const resultsHeaders = wrapper.findAll('.results-list h4')
    
    participantsHeaders.forEach(header => {
      expect(header.text()).toBe('Participants')
    })
    
    resultsHeaders.forEach(header => {
      expect(header.text()).toBe('Results')
    })
  })

  it('handles empty round results', () => {
    const wrapper = mount(RoundList, {
      global: {
        plugins: [mockStore]
      }
    })

    const resultItems = wrapper.findAll('.result-item')
    expect(resultItems).toHaveLength(30) // 3 rounds * 10 places each
  })

  it('logs position information for debugging', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const mockHorses = [
      { id: 'horse1', name: 'Test Horse' }
    ]
    mockGetRoundHorses.mockReturnValue(mockHorses)
    mockGetFinishedOrder.mockReturnValue(['horse1'])
    mockStore.state.result = {
      1: [{ horseId: 'horse1', isFinished: true }]
    }

    mount(RoundList, {
      global: {
        plugins: [mockStore]
      }
    })

    expect(consoleSpy).toHaveBeenCalledWith('Position 1: Finished horse - Test Horse')
    consoleSpy.mockRestore()
  })
})
