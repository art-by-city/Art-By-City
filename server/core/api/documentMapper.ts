import DomainEntity from '../common/entity'
import Document from '../common/document'

export default interface DocumentMapper<
  DE extends DomainEntity,
  DOC extends Document
> {
  toDocument(domainEntity: DE): DOC
  toDomainEntity(document: DOC): DE
}
