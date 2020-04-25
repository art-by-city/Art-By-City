export interface User {
  id: string
  username: string
  password?: string
}

let nextId = 0

const users: User[] = [{ id: '0', username: 'jim', password: 'hellothere' }]

const serializeUser = (user: User, callback: Function) => {
  callback(null, user.id)
}

const deserializeUser = (id: string, callback: Function) => {
  const user = users.find((u) => u.id === id)

  if (user) {
    callback(null, { id: user.id, username: user.username })
  }

  callback(new Error('Could not deserialize user: User not found'))
}

const authenticateUser = (username: string, password: string) => {
  const user = users.find(
    (u) => u.username === username && u.password === password
  )

  return sanitizeUser(user)
}

const findUserById = (id: string) => {
  const user = users.find((u) => u.id === id)

  return sanitizeUser(user)
}

const sanitizeUser = (user: User | undefined) => {
  if (!user) {
    return user
  }

  const _user: User = { ...user }
  if (_user && _user.password) {
    delete _user.password
  }

  return _user
}

const isUsernameUnique = (username: string) => {
  return !users.find((u) => u.username === username)
}

const addUser = (username: string, password: string, callback: Function) => {
  if (isUsernameUnique(username)) {
    nextId++
    const id = nextId.toString()
    const user = { id, username, password }
    users.push(user)
    callback(null, user)
  } else {
    callback(new Error('Username already taken'))
  }
}

export {
  serializeUser,
  deserializeUser,
  authenticateUser,
  findUserById,
  addUser
}
