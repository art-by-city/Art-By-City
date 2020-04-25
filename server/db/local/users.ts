export interface User {
  id: string
  username: string
  displayName: string
  password?: string
  roles: string[]
}

let nextId = 0

const users: User[] = [
  {
    id: '0',
    username: 'jim',
    displayName: 'jim',
    password: 'hellothere',
    roles: ['admin', 'artist']
  },
  {
    id: '1',
    username: 'guest',
    displayName: 'guest',
    password: 'guest',
    roles: []
  },
  {
    id: '2',
    username: 'mike',
    displayName: 'mike',
    password: 'mike',
    roles: ['admin', 'artist']
  }
]

const serializeUser = (user: User, callback: Function) => {
  callback(null, user.id)
}

const deserializeUser = (id: string, callback: Function) => {
  const user = users.find((u) => u.id === id)

  if (user) {
    callback(null, sanitizeUser(user))
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
    const user = { id, username, password, displayName: username, roles: [] }
    users.push(user)
    callback(null, user)
  } else {
    callback(new Error('Username already taken'))
  }
}

const updateUser = (
  id: string,
  password: string,
  newPassword: string,
  displayName: string,
  roles?: string[]
) => {
  const user = users.find((u) => u.id === id)

  if (user && user.password === password) {
    if (newPassword) {
      user.password = newPassword
    }
    user.displayName = displayName
    if (roles) {
      user.roles = roles
    }

    return true
  }

  return false
}

const resetPassword = (username: string, newPassword: string) => {
  const user = users.find((u) => u.username === username)

  if (user) {
    user.password = newPassword

    return true
  }

  return false
}

const listUsers = () => users

const setUserRoles = (id: string, roles: string[]) => {
  const user = users.find((u) => u.id === id)

  if (user) {
    user.roles = roles

    return true
  }

  return false
}

export {
  serializeUser,
  deserializeUser,
  authenticateUser,
  findUserById,
  addUser,
  updateUser,
  resetPassword,
  listUsers,
  setUserRoles
}
