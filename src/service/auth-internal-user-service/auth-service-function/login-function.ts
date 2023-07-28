import { TypeCode } from '@/src/repository/internal-user-repo/internal-user-entity'
import { InternalUserRepository } from '@/src/repository/internal-user-repo/internal-user-repository'
import {
  CommonResponse,
  comparePassword,
  decodeBase64,
  generateUserToken,
  sendEmail,
  validate,
} from 'common-abstract-fares-system'
import { v4 as uuidv4 } from 'uuid'
import {
  AuthInternalUserReqError,
  AuthUserValidatorSchema,
  InternalUserLoginReq,
} from '../auth-internal-user-req'
import { InternalUserLoginRes } from '../auth-internal-user-res'

/*
    @ericchen:

    put your explanation here
*/

const smtpOption = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: true,
  auth: {
    user: process.env.SMTP_USER || 'user',
    pass: process.env.SMTP_PASSWORD || 'password',
  },
}

export const loginFunction = async (
  loginReq: InternalUserLoginReq,
  repository: InternalUserRepository
): Promise<CommonResponse<AuthInternalUserReqError | InternalUserLoginRes | string>> => {
  const validateRes = await validate(loginReq, AuthUserValidatorSchema)
  if (validateRes.isError) {
    return {
      success: false,
      message: '',
      status: 400,
      result: validateRes.error,
    }
  }
  const findUsername = await repository.findOne('username', loginReq.username)
  if (!findUsername.result) {
    return {
      success: false,
      message: '',
      result: {
        username: 'not found user name',
        password: '',
      },
      status: 400,
    }
  }
  const comparePassResult = await comparePassword(
    decodeBase64(loginReq.password),
    findUsername.result.password
  )
  if (!comparePassResult) {
    return {
      success: false,
      message: '',
      result: {
        username: '',
        password: 'wrong password',
      },
      status: 400,
    }
  }
  if (findUsername.result.twoFactor) {
    const fiveDaysLater = new Date()
    fiveDaysLater.setMinutes(fiveDaysLater.getMinutes() + 5)
    const code = uuidv4()
    await sendEmail(smtpOption, 'fares.sys.vn@gmail.com', {
      to: findUsername.result.email,
      subject: 'login code',
      html: `<p>${code}</p>`,
    })
    await repository.update([
      {
        ...findUsername.result,
        codes:
          findUsername.result.codes.length < 10
            ? [...findUsername.result.codes, { code, type: TypeCode.LOGIN, expired: fiveDaysLater }]
            : [
                ...findUsername.result.codes.filter((item, index) => index > 0),
                { code, type: TypeCode.LOGIN, expired: fiveDaysLater },
              ],
      },
    ])
    return {
      success: true,
      message: 'sent login code to your email!',
      result: TypeCode.LOGIN,
      status: 200,
    }
  }
  const token = generateUserToken({ userId: findUsername.result._id.toString() })
  await repository.update([
    {
      ...findUsername.result,
      token,
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
