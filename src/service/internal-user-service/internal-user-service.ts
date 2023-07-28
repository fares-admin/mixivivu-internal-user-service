import { InternalUser } from '@/src/repository/internal-user-repo/internal-user-entity'
import { InternalUserRepository } from '@/src/repository/internal-user-repo/internal-user-repository'
import { CommonListResult, CommonResponse, CommonService } from 'common-abstract-fares-system'
import { NextApiRequest } from 'next'
import { InternalUserReq, InternalUserReqError } from './internal-user-req'
import { InternalUserRes } from './internal-user-res'
import {
  addNewUserFunction,
  deleteUserFunction,
  getListUsersFunc,
  updateUserFunction,
} from './internal-user-service-function'

export class InternalUserService extends CommonService<InternalUserRepository> {
  constructor() {
    super(new InternalUserRepository())
  }

  public async getListUsers(
    req: NextApiRequest
  ): Promise<CommonResponse<CommonListResult<InternalUserRes> | string>> {
    return await getListUsersFunc(
      req,
      this.repository,
      this.getPageAndSize,
      this.generatePipelineAggregate(req.query, new InternalUser()),
      this.responseList
    )
  }

  public async addNewUser(
    req: NextApiRequest
  ): Promise<CommonResponse<InternalUserReqError | string>> {
    return await addNewUserFunction(req.body, this.repository, req.query)
  }

  public async updateUser(
    req: InternalUserReq,
    id: string
  ): Promise<CommonResponse<InternalUserReqError | string>> {
    return await updateUserFunction(req, id, this.repository)
  }

  public async deleteUser(ids: string): Promise<CommonResponse<string>> {
    return await deleteUserFunction(ids, this.repository)
  }
}
