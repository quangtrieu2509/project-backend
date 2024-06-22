export interface IConvo {
  id: string
  members: string[]
  latestMessage: {
    userId: string
    content: string
  }
  isSeen: boolean
}
