export interface ITrip {
  id: string
  ownerId: string
  title: string
  description?: string
  privacy: string
  destination: {
    id: string
    name: string
    details?: string
    image: string
    level: number
    slug: string
  }
  startDate?: Date
  tripLength: number
  saves?: object[]
  itinerary?: object[]
}
