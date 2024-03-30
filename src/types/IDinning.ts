export interface IDinning {
  id: string
  locationId: string
  name: string
  coordinates: number[]
  addressDetail: string
  description: string
  images: string[]
  phoneNumber: string
  openingHours: {
    monday: number[][]
    tuesday: number[][]
    wednesday: number[][]
    thursday: number[][]
    friday: number[][]
    saturday: number[][]
    sunday: number[][]
  }
  website?: string
  email?: string
  mealTypes?: string[]
  features?: string[]
  priceRange?: number[] // currency
}
