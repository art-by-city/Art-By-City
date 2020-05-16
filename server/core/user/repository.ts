import { injectable } from 'inversify'
import { Collection } from 'firebase-firestorm'

import User from './user'
import UserRepositoryInterface from './repository.interface'

// TODO -> Fix all this garbage :)

@injectable()
export default class UserRepository implements UserRepositoryInterface {
  async create(username: string, password: string): Promise<User | null> {
    if (!(await this.getByUsername(username))) {
      // TODO -> this shouldn't be done in repository
      const user = new User()
      user.username = username
      user.password = password

      return await Collection(User).create(user)
    }

    throw new Error('Error creating user: Username already taken')
  }

  async get(id: string): Promise<User | null> {
    try {
      return await Collection(User).get(id)
    } catch (error) {
      throw new Error(`Error getting user by id: ${error.message}`)
    }
  }

  async update(user: User): Promise<User | null> {
    try {
      return await Collection(User).update(user)
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`)
    }
  }

  async getByUsername(username: string): Promise<User | null> {
    try {
      const { empty, docs } = await Collection(User)
        .query()
        .where('username', '==', username)
        .get()

      if (empty) {
        return null
      }

      return docs[0]
    } catch (error) {
      throw new Error(`Error getting user by username: ${error.message}`)
    }
  }

  async list(): Promise<User[]> {
    try {
      const { empty, docs } = await Collection(User)
        .query()
        .get()

      return empty ? [] : docs
    } catch (error) {
      throw new Error(`Error listing users: ${error.message}`)
    }
  }
}
