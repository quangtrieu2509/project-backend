export interface IUser {
  id: string
  familyName: string
  givenName: string
  email: string
  password?: string
  phoneNumber?: string
  profileImage: string
  accountType: string
  role: string
  isActive: boolean
}
