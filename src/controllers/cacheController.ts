import { Bucket, Storage } from '@google-cloud/storage'
import { Request, Response } from 'express'
import Notion from '../data/notion'
import Week from '../models/week'

export default class CacheController {
  notion: Notion
  storage: Storage

  bucket: Bucket

  constructor (storage: Storage, notion: Notion) {
    this.notion = notion
    this.storage = storage

    this.bucket = this.storage.bucket(process.env.BUCKET_NAME ?? '')
  }

  async cache (req: Request, res: Response): Promise<void> {
    const weeks = await this.notion.getUpcomingWeeks()


    const uploads = weeks.map((week: Week) => {
      return this.bucket.upload(JSON.stringify(week.toDTO()), {
        destination: `weeks/${week.date}.json`,
      })
    })

    await Promise.all(uploads)

    res.sendStatus(200)
  }
}
