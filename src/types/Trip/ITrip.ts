export interface ITrip {
  id: string
  ownerId: string
  title: string
  description?: string
  privacy: string
  //   destination: string
  startDate?: Date
  tripLength: number
  saves?: object[]
  itinerary?: object[]
}
