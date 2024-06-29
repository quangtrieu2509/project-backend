export interface IAttraction {
  id: string
  itemId: string
  categories: string[]
  ticketPrice?: number[]
  hours: Array<{
    open: string
    close: string
  } | null>
}
