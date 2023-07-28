export class InternalUserRes {
  _id: string = ''

  name: string = ''

  username: string = ''

  email: string = ''

  phone: string = ''

  created: Date = new Date()

  modified: Date = new Date()

  twoFactor: boolean = true

  verify: boolean = true

  active: boolean = true
}
