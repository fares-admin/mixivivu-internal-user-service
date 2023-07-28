import { InternalUserRepository } from '@/src/repository/internal-user-repo/internal-user-repository'
import { TValidateFunction } from 'common-abstract-fares-system/lib/validation-tool/type-validation'

export const IS_PHONE_CUSTOM: TValidateFunction = async <T extends object>(
  error: Record<keyof T, string>,
  value: any,
  key: keyof T,
  params?: any
) => {
  const PHONE_REGEX = /^(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})$/g
  if (!value) {
    return { ...error, [key]: 'required' }
  }
  const newValue = String(value)
  if (!newValue.match(PHONE_REGEX)) {
    return { ...error, [key]: 'invalid phone' }
  }
  const repository = new InternalUserRepository()
  const findPhone = await repository.findOne('phone', value)
  if (findPhone.result) {
    if (!!params?.id && params?.id !== findPhone.result._id.toString()) {
      return {
        ...error,
        phone: 'phone exited',
      }
    }
    if (!params?.id) {
      return {
        ...error,
        phone: 'phone exited',
      }
    }
  }
  return { ...error, [key]: '' }
}
