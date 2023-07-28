import { InternalUserRepository } from '@/src/repository/internal-user-repo/internal-user-repository'
import { TValidateFunction } from 'common-abstract-fares-system/lib/validation-tool/type-validation'

export const IS_EMAIL_CUSTOM: TValidateFunction = async <T extends object>(
  error: Record<keyof T, string>,
  value: any,
  key: keyof T,
  params?: any
) => {
  const EMAIL_REGEX =
    /^(?=.{1,64}@)[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/g

  if (!value) {
    return { ...error, [key]: 'required' }
  }
  const newValue = String(value)
  if (!newValue.match(EMAIL_REGEX)) {
    return { ...error, [key]: 'invalid email' }
  }
  const repository = new InternalUserRepository()
  const findEmail = await repository.findOne('email', value)
  if (findEmail.result) {
    if (!!params?.id && params?.id !== findEmail.result._id.toString()) {
      return {
        ...error,
        email: 'email exited',
      }
    }
    if (!params?.id) {
      return {
        ...error,
        email: 'email exited',
      }
    }
  }
  return { ...error, [key]: '' }
}
