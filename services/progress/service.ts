class ProgressService {
  numRequests: number = 0

  get isInProgress() {
    return this.numRequests > 0
  }

  start() {
    this.numRequests++
  }

  stop() {
    if (this.numRequests > 0) {
      this.numRequests--
    }
  }
}

export default new ProgressService()
