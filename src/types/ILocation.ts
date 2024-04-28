export interface ILocation {
  id: string
  name: string
  coordinates: number[]
  ancestors: Array<{
    id: string
    name: string
    level: number
    slug: string
  }>
  description: string
  images: string[]
  slug: string
  level: number
}
