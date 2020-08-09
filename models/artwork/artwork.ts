export default interface Artwork {
  id: string
  created: Date
  updated: Date
  title: string
  owner: {
    id: string
    username: string
  }
  description: string
  type: string
  city: string
  hashtags: string[]
  images: any[]
  likes: string[]
  published: boolean
  approved: boolean
}
