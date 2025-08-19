export interface Horse {
  id: string
  name: string
  color: string
  colorCode: number[]
}

export interface HorseWithCondition extends Horse {
  condition: number
}