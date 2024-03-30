export interface IActivity {
  id: string
  locationId: string
  name: string
  coordinates?: number[]
  addressDetail?: string
  description: string
  images: string[]
  phoneNumber: string
  types: string[]
  website?: string
  email?: string
  ages?: number[]
  duration?: number // time
  priceRange?: number[] // currency
  included?: string[]
  excluded?: string[]
  requirements?: string[]
  itinerary?: object[]
  TnC?: string[]
  cancellationPolicies?: string[]
}
