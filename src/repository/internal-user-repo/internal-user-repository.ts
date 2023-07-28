import { CommonRepository } from 'common-abstract-fares-system'
import { InternalUser, InternalUserSchema } from './internal-user-entity'

export class InternalUserRepository extends CommonRepository<InternalUser> {
  constructor() {
    super(InternalUserSchema, 'internal-user')
  }
}
