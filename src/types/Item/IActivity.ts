export interface IActivity {
  id: string
  itemId: string
  categories: string[]
  ticketPrice?: number[] // currency
  duration?: {
    value: number
    unit: string
  }
  ages?: number[]
  included?: string
  excluded?: string
  requirements?: string
  // itinerary?: object[]
}
