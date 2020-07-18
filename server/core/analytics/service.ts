import { injectable, inject } from 'inversify'

import ApiServiceResult from '../api/results/apiServiceResult.interface'
import { UserEvent, UserEventService } from '../events/user'
import { AnalyticsService } from './'
import UnknownError from '../api/errors/unknownError'
import ApiServiceSuccessResult from '../api/results/apiServiceSuccessResult'

@injectable()
export default class AnalyticsServiceImpl implements AnalyticsService {
  private userEventService: UserEventService

  constructor(
    @inject(Symbol.for('UserEventService'))
    userEventService: UserEventService
  ) {
    this.userEventService = userEventService
  }

  async fetchEvents(): Promise<ApiServiceResult<UserEvent[]>> {
    try {
      const events = await this.userEventService.fetchEvents()

      return new ApiServiceSuccessResult(events)
    } catch (error) {
      throw new UnknownError(error.message)
    }
  }
}
