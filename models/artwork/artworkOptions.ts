export default interface ArtworkOptions {
  city: string,
  type: string,
  hashtags: string[],
  limit: number
}

export const artworkTypes = [
  'Painting',
  'Illustration',
  'Drawing',
  'Sculpture',
  'Photograph',
  'Mixed-Media',
  'Digital',
  'Other'
]
