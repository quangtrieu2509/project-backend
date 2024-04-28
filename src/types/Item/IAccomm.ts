export interface IAccomm {
  id: string
  itemId: string
  categories: string[]
  price: {
    level: string
    range?: number[]
  }
  amenities?: string[]
}
