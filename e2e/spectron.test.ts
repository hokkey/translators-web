import * as path from 'path'
import { Application } from 'spectron'

describe('Application launch', () => {
  let app: Application

  const electronPath = path.join(
    __dirname,
    '..',
    'node_modules',
    '.bin',
    'electron'
  )

  const appPath = path.join(
    path.join(__dirname, '..')
  )

  const timeout = 10 * 1000

  beforeAll(async () => {
    app = new Application({
      path: electronPath,
      args: [appPath]
    })
    await app.start()
    return app
  }, timeout)

  afterAll(() => {
    if (!app || !app.isRunning()) return

    return app.client.execute(() => {
      if (window) { window.close() }
    })
  }, timeout)

  it('shows an initial window', (done) => {
    return app.client.getWindowCount().then((count) => {
      expect(count).toBe(3)
      done()
    })
  }, timeout)
})
