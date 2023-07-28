import { AuthInternalUserService } from '@/src/service/auth-internal-user-service/auth-internal-user-service'
import { wrapperEndpoint } from 'common-abstract-fares-system'
import { NextApiRequest, NextApiResponse } from 'next'

/*
    @ericchen:

    put your explanation here
*/

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const service = new AuthInternalUserService()
  const result = await wrapperEndpoint(req, 'POST', service.login(req.body))
  res.status(200).json(result)
}
