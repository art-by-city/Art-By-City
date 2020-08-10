import ViewModel from '../../api/viewModel'
import { UserViewModel } from '../../user'
import { ArtworkImage } from '../'

export default interface ArtworkViewModel extends ViewModel {
  id: string
  owner: UserViewModel
  title: string
  description: string
  type: string
  city: string
  hashtags: string[]
  images: ArtworkImage[]
  likes: string[]
  published: boolean
  approved: boolean
}
