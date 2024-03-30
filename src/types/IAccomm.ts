export interface IAccomm {
  id: string
  locationId: string
  name: string
  coordinates: number[]
  addressDetail: string
  description: string
  images: string[]
  phoneNumber: string
  type: string
  website?: string
  email?: string
  amenities?: string[]
  roomFeatures?: string[]
  roomTypes?: string[]
  priceRange?: number[] // currency
  TnC?: string[]
  cancellationPolicies?: string[]
}
