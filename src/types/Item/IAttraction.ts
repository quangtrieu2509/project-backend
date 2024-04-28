export interface IAttraction {
  id: string
  itemId: string
  categories: string[]
  price?: number[]
  hours: Array<{
    open: string
    close: string
  } | null>
}
