import { injectable, inject } from 'inversify'

import ApiServiceResult from '../api/results/apiServiceResult.interface'
import { UserEventViewModel, UserEventService } from '../events/user'
import { AnalyticsService } from './'
import UnknownError from '../api/errors/unknownError'
import ApiServiceSuccessResult from '../api/results/apiServiceSuccessResult'
import UserEventMapper from '../events/user/mapper'

@injectable()
export default class AnalyticsServiceImpl implements AnalyticsService {
  private userEventService: UserEventService

  constructor(
    @inject(Symbol.for('UserEventService'))
    userEventService: UserEventService
  ) {
    this.userEventService = userEventService
  }

  async fetchEvents(): Promise<ApiServiceResult<UserEventViewModel[]>> {
    try {
      const events = await this.userEventService.fetchEvents()

      return new ApiServiceSuccessResult(events.map((event) => {
        return new UserEventMapper().toViewModel(event)
      }))
    } catch (error) {
      throw new UnknownError(error.message)
    }
  }
}
