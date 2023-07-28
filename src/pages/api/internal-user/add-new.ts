import { NextApiRequest, NextApiResponse } from 'next'

import { AuthInternalUserService } from '@/src/service/auth-internal-user-service/auth-internal-user-service'
import { InternalUserService } from '@/src/service/internal-user-service/internal-user-service'
import { wrapperEndpoint } from 'common-abstract-fares-system'

/*
    @ericchen:

    put your explanation here
*/

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const service = new InternalUserService()
  const serviceAuth = new AuthInternalUserService()
  const authResult = await serviceAuth.verifyInternalUserToken(
    req.headers.authorization || '',
    '',
    true
  )
  if (!authResult.success) {
    res.status(200).json(authResult)
  } else {
    const result = await wrapperEndpoint(req, 'POST', service.addNewUser(req))
    res.status(200).json(result)
  }
}
