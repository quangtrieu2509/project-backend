export interface IReview {
  id: string
  userId: string
  itemId: string
  rate: number
  travelDate: Date
  tripType: string
  content: string
  images: string[]
  isActive: boolean
}
