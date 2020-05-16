import User from '../user/user'

export default (roles: string[]) => {
  return (req: any, res: any, next: Function) => {
    const user = <User>req.user

    for (let i = 0; i < roles.length; i++) {
      if (!(user.roles || []).includes(roles[i])) {
        res.send(401)
      }
    }

    next()
  }
}
