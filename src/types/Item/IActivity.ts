export interface IActivity {
  id: string
  itemId: string
  categories: string[]
  price?: number[] // currency
  duration?: number // time
  ages?: number[]
  included?: string[]
  excluded?: string[]
  requirements?: string[]
  // itinerary?: object[]
}
