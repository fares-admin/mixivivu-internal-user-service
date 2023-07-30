import { CommonListResult, CommonResponse } from 'common-abstract-fares-system'

import { InternalUserRepository } from '@/src/repository/internal-user-repo/internal-user-repository'
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
  pipelines: mongoose.PipelineStage[]
): Promise<CommonResponse<CommonListResult<InternalUserRes> | string>> => {
  const { page, size } = getPageAndSize(req as any)
  const result = await repository.find(page, size, pipelines)
  if (!result.result) {
    return {
      status: 500,
      message: 'sv err',
      success: false,
      result: '',
    }
  }
  return {
    status: 200,
    message: 'ok',
    success: true,
    result: {
      ...result.result,
      data: result.result.data.map((item) => {
        return {
          ...item,
          _id: item._id.toString(),
        }
      }),
    },
  }
}
