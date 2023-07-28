import { InternalUser } from '@/src/repository/internal-user-repo/internal-user-entity'
import { InternalUserRepository } from '@/src/repository/internal-user-repo/internal-user-repository'
import { CommonResponse, CommonService } from 'common-abstract-fares-system'
import { AuthInternalUserReqError, InternalUserLoginReq } from './auth-internal-user-req'
import { InternalUserLoginRes } from './auth-internal-user-res'
import {
  loginFunction,
  verifyLoginCodeFunction,
  verifyTokenFunction,
} from './auth-service-function'

export class AuthInternalUserService extends CommonService<InternalUserRepository> {
  constructor() {
    super(new InternalUserRepository())
  }

  public async login(
    loginReq: InternalUserLoginReq
  ): Promise<CommonResponse<AuthInternalUserReqError | InternalUserLoginRes | string>> {
    return await loginFunction(loginReq, this.repository)
  }

  public async verifyLoginCode(
    username: string,
    code: string
  ): Promise<CommonResponse<InternalUserLoginRes | string>> {
    return verifyLoginCodeFunction(username, code, this.repository)
  }

  public async verifyInternalUserToken(
    userToken: string,
    serviceToken: string,
    isInternalService: boolean
  ): Promise<CommonResponse<InternalUser | string>> {
    return await verifyTokenFunction(userToken, serviceToken, this.repository, isInternalService)
  }
}
