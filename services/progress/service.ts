class ProgressService {
  numRequests: number = 0

  get isInProgress() {
    return this.numRequests > 0
  }

  start() {
    this.numRequests = this.numRequests + 1
    if (process.client) {
      window?.$nuxt.$loading.start()
    }
  }

  stop() {
    if (this.numRequests > 0) {
      this.numRequests = this.numRequests - 1
    }

    if (process.client && this.numRequests <= 0) {
      window?.$nuxt.$loading.finish()
    }
  }
}

export default new ProgressService()
