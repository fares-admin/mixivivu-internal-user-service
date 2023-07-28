import { InternalUser } from '@/src/repository/internal-user-repo/internal-user-entity'
import { InternalUserRepository } from '@/src/repository/internal-user-repo/internal-user-repository'
import { CommonResponse, convertValue, hashPassword, validate } from 'common-abstract-fares-system'
import { InternalUserReq, InternalUserReqError, UserValidatorSchema } from '../internal-user-req'

/*
    @ericchen:

    put your explanation here
*/

export const addNewUserFunction = async (
  req: InternalUserReq,
  repository: InternalUserRepository,
  query: any
): Promise<CommonResponse<InternalUserReqError | string>> => {
  const validateRes = await validate(req, UserValidatorSchema, query)
  if (validateRes.isError) {
    return {
      success: false,
      result: validateRes.error,
      message: 'invalidRequest',
      status: 400,
    }
  }
  const entity = convertValue<InternalUser>(req, new InternalUser())
  const password = await hashPassword(process.env.DEFAULT_PASSWORD || '')
  const { error } = await repository.insert([{ ...entity, password, codes: [] }])
  if (error) {
    return {
      status: 500,
      message: error || '',
      result: '',
      success: false,
    }
  }
  return {
    status: 200,
    message: 'ok',
    result: '',
    success: true,
  }
}
