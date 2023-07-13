import setupExpress from './config/express.js'
import DashboardController from './controllers/dashboardController.js'
import WeekController from './controllers/weekController.js'
import { type Express, type Request, type Response } from 'express'
import type Notion from './data/notion'
import PreviousController from './controllers/previousController.js'
import { Storage } from '@google-cloud/storage'

class Application {
  express: Express
  notion: Notion
  storage: Storage

  constructor (notion: Notion) {
    this.express = setupExpress()
    this.storage = new Storage()
    this.notion = notion
    this.registerRoutes()
  }

  /**
   * This currently only works for GET requests
   */
  routes (): Map<string, (req: Request, res: Response) => void> {
    const weekController = new WeekController(this.notion)

    return new Map([
      [DashboardController.PATHS.index, DashboardController.index],
      [PreviousController.PATHS.index, PreviousController.index],
      ['/api/weeks', weekController.index.bind(weekController)],
      ['/api/weeks/:date', weekController.show.bind(weekController)],
    ])
  }

  registerRoutes (): void {
    this.routes().forEach((handler, route) => {
      this.express.get(route, handler)
    })
  }

  listen (): void {
    const port = process.env.PORT ?? 8080

    this.express.listen(port, () => {
      console.log(`Listening on port ${port}...`) // eslint-disable-line no-console
    })
  }
}

export default Application
