export interface IAttraction {
  id: string
  locationId: string
  name: string
  coordinates: number[]
  addressDetail: string
  description: string
  images: string[]
  types: string[]
  openingHours: {
    monday: number[][]
    tuesday: number[][]
    wednesday: number[][]
    thursday: number[][]
    friday: number[][]
    saturday: number[][]
    sunday: number[][]
  }
  phoneNumber?: string
  website?: string
  email?: string
  ticketPrices?: number[] // currency
}
