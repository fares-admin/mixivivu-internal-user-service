import { IS_REQUIRED, ObjectValidator } from 'common-abstract-fares-system'
import { IS_EMAIL_CUSTOM } from './custom-validation/IS_EMAIL_CUSTOM'
import { IS_PHONE_CUSTOM } from './custom-validation/IS_PHONE_CUSTOM'
import { IS_USERNAME_CUSTOM } from './custom-validation/IS_USERNAME_CUSTOM'

export class InternalUserReq {
  name: string = ''

  username: string = ''

  email: string = ''

  phone: string = ''
}

export const UserValidatorSchema: ObjectValidator<InternalUserReq> = {
  name: IS_REQUIRED,
  username: IS_USERNAME_CUSTOM,
  phone: IS_PHONE_CUSTOM,
  email: IS_EMAIL_CUSTOM,
}

export type InternalUserReqError = Record<keyof InternalUserReq, string>
