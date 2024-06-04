export interface ITrip {
  id: string
  ownerId: string
  locationId: string
  title: string
  description?: string
  privacy: string
  startDate?: Date
  tripLength: number
  image: {
    name: string
    url: string
  }
}
