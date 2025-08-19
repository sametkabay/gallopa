import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import InfoBox from '../../../components/info-box.vue'

describe('InfoBox Component', () => {
  it('renders info box container', () => {
    const wrapper = mount(InfoBox)
    
    expect(wrapper.find('.info-box').exists()).toBe(true)
  })

  it('displays correct title', () => {
    const wrapper = mount(InfoBox)
    
    expect(wrapper.find('h3').text()).toBe('Race Mathematics')
  })

  it('contains list of race information', () => {
    const wrapper = mount(InfoBox)
    
    const listItems = wrapper.findAll('li')
    expect(listItems.length).toBeGreaterThan(0)
  })

  it('displays movement calculation information', () => {
    const wrapper = mount(InfoBox)
    
    const text = wrapper.text()
    expect(text).toContain('Movement Calculation')
    expect(text).toContain('Each horse moves 1-10 meters every 100ms')
  })

  it('displays random component information', () => {
    const wrapper = mount(InfoBox)
    
    const text = wrapper.text()
    expect(text).toContain('Random Component')
    expect(text).toContain('7 meters are completely random (1-7 range)')
  })

  it('displays condition component information', () => {
    const wrapper = mount(InfoBox)
    
    const text = wrapper.text()
    expect(text).toContain('Condition Component')
    expect(text).toContain('3 meters are based on horse condition (1-3 range)')
  })

  it('displays condition formula information', () => {
    const wrapper = mount(InfoBox)
    
    const text = wrapper.text()
    expect(text).toContain('Condition Formula')
    expect(text).toContain('Math.floor((condition / 100) * 3) + 1')
  })

  it('displays total movement information', () => {
    const wrapper = mount(InfoBox)
    
    const text = wrapper.text()
    expect(text).toContain('Total Movement')
    expect(text).toContain('Random + Condition = 1-10 meters per tick')
  })

  it('displays update frequency information', () => {
    const wrapper = mount(InfoBox)
    
    const text = wrapper.text()
    expect(text).toContain('Update Frequency')
    expect(text).toContain('Every 300 milliseconds (0.3 seconds)')
  })

  it('displays round distances information', () => {
    const wrapper = mount(InfoBox)
    
    const text = wrapper.text()
    expect(text).toContain('Round Distances')
    expect(text).toContain('Round 1: 1200m')
    expect(text).toContain('Round 2: 1400m')
    expect(text).toContain('Round 3: 1600m')
    expect(text).toContain('Round 4: 1800m')
    expect(text).toContain('Round 5: 2000m')
    expect(text).toContain('Round 6: 2200m')
  })

  it('displays horse selection information', () => {
    const wrapper = mount(InfoBox)
    
    const text = wrapper.text()
    expect(text).toContain('Horse Selection')
    expect(text).toContain('10 horses randomly selected per round from 20 total horses')
  })

  it('displays condition range information', () => {
    const wrapper = mount(InfoBox)
    
    const text = wrapper.text()
    expect(text).toContain('Condition Range')
    expect(text).toContain('Each horse has a condition value between 1-100')
  })

  it('displays finish detection information', () => {
    const wrapper = mount(InfoBox)
    
    const text = wrapper.text()
    expect(text).toContain('Finish Detection')
    expect(text).toContain('Horse finishes when distance ≥ round distance')
  })

  it('displays position tracking information', () => {
    const wrapper = mount(InfoBox)
    
    const text = wrapper.text()
    expect(text).toContain('Position Tracking')
    expect(text).toContain('Horses are ranked by finish order (1st, 2nd, 3rd...)')
  })

  it('displays animation control information', () => {
    const wrapper = mount(InfoBox)
    
    const text = wrapper.text()
    expect(text).toContain('Animation Control')
    expect(text).toContain('Running animation stops when horse finishes')
  })

  it('applies correct styling classes', () => {
    const wrapper = mount(InfoBox)
    
    expect(wrapper.find('.info-box').classes()).toContain('info-box')
    expect(wrapper.find('.info-content').classes()).toContain('info-content')
  })

  it('renders all list items with proper structure', () => {
    const wrapper = mount(InfoBox)
    
    const listItems = wrapper.findAll('li')
    listItems.forEach((item: any) => {
      expect(item.find('strong').exists()).toBe(true)
    })
  })
})
