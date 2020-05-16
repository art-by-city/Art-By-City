export type ArtworkType =
  | 'Painting'
  | 'Illustration'
  | 'Drawing'
  | 'Sculpture'
  | 'Photograph'
  | 'Mixed-Media'
  | 'Digital'
  | 'Other'

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

export type Region =
  | 'NYC'
  | 'LA'
  | 'Chicago'
  | 'Houston'
  | 'Phoenix'
  | 'Philadelphia'
  | 'San Antonio'
  | 'San Diego'
  | 'Dallas'
  | 'San Jose'
  | 'Seattle'
  | 'Portland'
  | 'Denver'
  | 'Boston'
  | 'DC'
  | 'Austin'

export const regions = [
  'NYC',
  'LA',
  'Chicago',
  'Houston',
  'Phoenix',
  'Philadelphia',
  'San Antonio',
  'San Diego',
  'Dallas',
  'San Jose',
  'Seattle',
  'Portland',
  'Denver',
  'Boston',
  'DC',
  'Austin'
]

export interface ArtworkImageInterface {
  source: string
}
