import mongoose from 'mongoose'

export enum TypeCode {
  FORGOT = 'forgot',
  LOGIN = 'login',
}

export interface ICode {
  code: string
  expired: Date
  type: TypeCode
}
export class InternalUser {
  _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()

  name: string = ''

  username: string = ''

  password: string = ''

  email: string = ''

  phone: string = ''

  created: Date = new Date()

  modified: Date = new Date()

  token: string = ''

  codes: ICode[] = []

  twoFactor: boolean = false

  verify: boolean = false

  active: boolean = false
}

export const InternalUserSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: String,
  username: String,
  password: String,
  email: String,
  phone: String,
  created: Date,
  modified: Date || null,
  codes: Array<{ code: String; expired: Date; type: TypeCode }>,
  token: String,
  twoFactor: Boolean,
  verify: Boolean,
  active: Boolean,
})
