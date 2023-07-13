import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals'

describe('cache', () => {
  describe('when the cache is empty', () => {
    beforeEach(() => {
      process.env.BUCKET_NAME = 'test-bucket'
    })

    it('saves all information in cache', () => {

    })
  })
})
