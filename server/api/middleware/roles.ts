import Account from '../../core/account/account.interface'

export default (roles: string[]) => {
  return (req: any, res: any, next: Function) => {
    const account = <Account>req.user

    for (let i = 0; i < roles.length; i++) {
      if (!(account.roles || []).includes(roles[i])) {
        res.send(401)
      }
    }

    next()
  }
}
