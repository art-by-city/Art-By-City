import { Router } from 'express'

export default interface Controller {
  getRouter(): Router
}
