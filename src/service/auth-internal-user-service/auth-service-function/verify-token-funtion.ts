import { InternalUser } from '@/src/repository/internal-user-repo/internal-user-entity'
import { InternalUserRepository } from '@/src/repository/internal-user-repo/internal-user-repository'
import {
  CommonResponse,
  convertValue,
  validateServiceToken,
  validateUserToken,
} from 'common-abstract-fares-system'
import mongoose from 'mongoose'
/*
    @ericchen:

    put your explanation here
*/
export const verifyTokenFunction = async (
  userToken: string,
  serviceToken: string,
  repository: InternalUserRepository,
  isInternalService: boolean
): Promise<CommonResponse<InternalUser | string>> => {
  if (!isInternalService) {
    try {
      const { serviceName } = validateServiceToken(serviceToken.split(' ')[1])
      if (!serviceName) {
        return {
          status: 500,
          message: 'invalid token',
          success: false,
          result: '',
        }
      }
      const serviceAccess = process.env.ACCESS_SCOPE?.split(',')
      if (!serviceAccess?.includes(serviceName)) {
        return {
          status: 500,
          message: 'no access',
          success: false,
          result: '',
        }
      }
    } catch (err) {
      return {
        status: 500,
        message: String(err),
        success: false,
        result: '',
      }
    }
  }
  try {
    const decoded = validateUserToken(userToken.split(' ')[1])
    if (!decoded || !decoded.userId) {
      return {
        status: 401,
        message: 'invalid token',
        success: false,
        result: '',
      }
    }
    const findUser = await repository.findOne('_id', new mongoose.Types.ObjectId(decoded.userId))
    if (findUser.error) {
      return {
        status: 401,
        message: String(findUser.error),
        success: false,
        result: '',
      }
    }
    if (!findUser.result) {
      return {
        status: 401,
        message: 'invalid user',
        success: false,
        result: '',
      }
    }
    if (findUser.result.token !== userToken) {
      return {
        status: 401,
        message: 'invalid user',
        success: false,
        result: '',
      }
    }
    return {
      status: 200,
      success: true,
      message: 'valid',
      result: convertValue(findUser.result, new InternalUser()),
    }
  } catch (err) {
    return {
      status: 401,
      message: String(err),
      success: false,
      result: '',
    }
  }
}
