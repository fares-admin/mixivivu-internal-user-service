import { InternalUser } from '@/src/repository/internal-user-repo/internal-user-entity'
import { InternalUserRepository } from '@/src/repository/internal-user-repo/internal-user-repository'
import { CommonListResult, CommonResponse, PipelineResponse } from 'common-abstract-fares-system'
import mongoose from 'mongoose'
import { NextApiRequest } from 'next'
import { InternalUserRes } from '../internal-user-res'

/*
    @ericchen:

    put your explanation here
*/

export const getListUsersFunc = async (
  req: NextApiRequest,
  repository: InternalUserRepository,
  getPageAndSize: (req: {
    query: {
      page: number
      size: number
    }
  }) => {
    page: number
    size: number
  },
  pipelines: mongoose.PipelineStage[],
  responseList: (
    result: PipelineResponse<CommonListResult<InternalUser>>,
    res: InternalUserRes
  ) => Promise<CommonResponse<CommonListResult<InternalUserRes> | string>>
): Promise<CommonResponse<CommonListResult<InternalUserRes> | string>> => {
  const { page, size } = getPageAndSize(req as any)
  const result = await repository.find(page, size, pipelines)

  return await responseList(result, new InternalUserRes())
}
