import { Entity } from 'firebase-firestorm'

export default class DomainEntity extends Entity {
  toJSON(): DomainEntity {
    const clean = Object.assign(this, {})

    delete clean.ref

    return clean
  }
}
