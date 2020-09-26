import DocumentMapper from '../api/documentMapper'
import { Artwork, ArtworkDocument } from './'

export default class ArtworkDocumentMapper implements DocumentMapper<
  Artwork,
  ArtworkDocument
> {
  toDocument(domainEntity: Artwork): ArtworkDocument {
    const doc = new ArtworkDocument()

    doc.id = domainEntity.id
    doc.owner = domainEntity.owner.id
    doc.title = domainEntity.title
    doc.description = domainEntity.description
    doc.type = domainEntity.type
    doc.city = domainEntity.city.id
    doc.hashtags = domainEntity.hashtags
    doc.images = domainEntity.images
    doc.likes = domainEntity.likes
    doc.published = domainEntity.published
    doc.approved = domainEntity.approved

    return doc
  }
}
