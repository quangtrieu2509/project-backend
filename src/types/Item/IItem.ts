export interface IItem {
  id: string
  ownerId: string
  ancestors: Array<{
    id: string
    name: string
    level: number
    slug: string
  }>
  name: string
  coordinates?: number[]
  address?: string[]
  description: string
  images: Array<{
    name: string
    url: string
  }>
  contacts?: {
    phoneNumber: string
    website?: string
    email?: string
  }
  type: string
  isReservable: boolean
  state: string
  adminUpdatedAt?: Date
  categories: string[]
  price?: {
    level: string
    range?: number[]
  }
  hours?: Array<{
    open: string
    close: string
  } | null>
  features?: string[]
  amenities?: string[]
  ticketPrice?: number[]
  duration?: {
    value: number
    unit: string
  }
  ages?: number[]
  included?: string[]
  excluded?: string[]
  requirements?: string[]
}
