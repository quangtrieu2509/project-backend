export interface IDining {
  id: string
  itemId: string
  categories: string[]
  price: {
    level: string
    range?: number[]
  }
  hours: Array<{
    open: string
    close: string
  } | null>
  features?: string[]
}
