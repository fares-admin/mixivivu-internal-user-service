import { TypeCode } from '@/src/repository/internal-user-repo/internal-user-entity'
import { InternalUserRepository } from '@/src/repository/internal-user-repo/internal-user-repository'
import { CommonResponse, generateUserToken } from 'common-abstract-fares-system'
import { InternalUserLoginRes } from '../auth-internal-user-res'

/*
    @ericchen:

    put your explanation here
*/

export const verifyLoginCodeFunction = async (
  username: string,
  code: string,
  repository: InternalUserRepository
): Promise<CommonResponse<InternalUserLoginRes | string>> => {
  if (!username || !code) {
    return {
      success: false,
      message: 'invalid login code!',
      result: '',
      status: 400,
    }
  }
  const findUsername = await repository.findOne('username', username)
  if (!findUsername.result) {
    return {
      success: false,
      message: 'not found user name',
      result: '',
      status: 400,
    }
  }
  const findCode = findUsername.result.codes.find((item) => item.code === code)
  if (!findCode) {
    return {
      success: false,
      message: 'invalid login code!',
      result: '',
      status: 400,
    }
  }
  if (
    findCode.code !== code ||
    findCode.type !== TypeCode.LOGIN.toString() ||
    findCode.expired.getTime() < new Date().getTime()
  ) {
    return {
      success: false,
      message: 'invalid login code!',
      result: '',
      status: 400,
    }
  }
  const token = generateUserToken({ userId: findUsername.result._id.toString() })
  await repository.update([
    {
      ...findUsername.result,
      token,
      codes: findUsername.result.codes.filter((item) => item.code !== code),
    },
  ])
  return {
    success: true,
    message: 'success!',
    result: {
      token,
    },
    status: 200,
  }
}
