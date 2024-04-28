export interface IItem {
  id: string
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
  images: string[]
  contacts?: {
    phoneNumber: string
    website?: string
    email?: string
  }
  type: string
}
