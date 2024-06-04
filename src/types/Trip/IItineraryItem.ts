export interface IItineraryItem {
  id: string
  savedItemId: string
  tripId: string
  day: number
  orderNumber: number
  hasBooked?: boolean
  startTime?: string
  note?: string
  numOfGuests?: number
  reservationNumber?: string
}
