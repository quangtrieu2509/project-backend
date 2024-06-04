export interface IBooking {
  id: string
  userId: string
  itemId: string
  note: string
  state: string
  date: Date
  startTime: string
  phoneNumber: string
  email: string
  numOfGuests?: number
  numOfRooms?: number
}
