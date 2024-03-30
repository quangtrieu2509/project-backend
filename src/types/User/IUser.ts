export interface IUser {
  id: string
  familyName: string
  givenName: string
  email: string
  password?: string
  phoneNumber?: string
  address?: string
  profileImage: string
  accountType: string
  role: string
  isActive: boolean
  links?: {
    facebook?: string
    instagram?: string
    twitter?: string
    youtube?: string
    tiktok?: string
  }
  bio?: string
}
