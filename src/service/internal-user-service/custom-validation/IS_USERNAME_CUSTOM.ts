import { InternalUserRepository } from '@/src/repository/internal-user-repo/internal-user-repository'
import { TValidateFunction } from 'common-abstract-fares-system/lib/validation-tool/type-validation'

export const IS_USERNAME_CUSTOM: TValidateFunction = async <T extends object>(
  error: Record<keyof T, string>,
  value: any,
  key: keyof T,
  params?: any
) => {
  if (!value) {
    return { ...error, [key]: 'required' }
  }
  const newValue = String(value)
  const USERNAME_REGEX = /^[a-zA-Z0-9\\._\\-]{3,}$/g

  if (!newValue.match(USERNAME_REGEX)) {
    return { ...error, [key]: 'invalid username' }
  }
  const repository = new InternalUserRepository()
  const findUsername = await repository.findOne('username', value)
  if (findUsername.result) {
    if (!!params?.id && params?.id !== findUsername.result._id.toString()) {
      return {
        ...error,
        username: 'username exited',
      }
    }
    if (!params?.id) {
      return {
        ...error,
        username: 'username exited',
      }
    }
  }
  return { ...error, [key]: '' }
}
