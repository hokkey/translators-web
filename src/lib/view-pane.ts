import { BrowserView, BrowserViewConstructorOptions, BrowserWindow } from 'electron'

type NullableRectangle = {
  width: number | null
  height: number | null
  x: number | null
  y: number | null
}

type IBrowserView = new (options: BrowserViewConstructorOptions) => BrowserView

export type ViewPaneConf = {
  url: string
  boundsOffset: NullableRectangle
  css?: string
  useragent?: string
}

export class ViewPane {
  public readonly url: string = ''
  private readonly boundsOffset: NullableRectangle
  private readonly css?: string
  private readonly useragent?: string
  private readonly browserView: BrowserView

  constructor(View: IBrowserView, conf: ViewPaneConf) {
    this.browserView = new View({
      webPreferences: {
        contextIsolation: true
      }
    })
    Object.assign<ViewPane, ViewPaneConf>(this, conf)
  }

  public mount(win: BrowserWindow): Promise<[void, string]> {
    win.addBrowserView(this.browserView)
    this.updateBounds(win)
    win.on('resize', () => this.updateBounds(win))
    return Promise.all([this.loadURL(), this.insertCSS()])
  }

  private updateBounds(win: BrowserWindow): void {
    const { width, height } = win.getBounds()
    this.browserView.setBounds({
      width: this.calcBounds(this.boundsOffset.width, width),
      height: this.calcBounds(this.boundsOffset.height, height),
      x: this.calcBounds(this.boundsOffset.x, width),
      y: this.calcBounds(this.boundsOffset.y, height)
    })
  }

  private loadURL(): Promise<void> {
    if (this.useragent) {
      this.browserView.webContents.setUserAgent(this.useragent)
    }
    return this.browserView.webContents.loadURL(this.url)
  }

  private insertCSS(): Promise<string> {
    return new Promise((resolve) => {
      this.browserView.webContents.on('dom-ready', () => {
        if (!this.css) return resolve('')
        resolve(this.browserView.webContents.insertCSS(this.css))
      })
    })
  }

  private calcBounds(offset: number | null, baseline: number): number {
    if (offset === null) return baseline
    if (offset >= 1) return offset
    if (offset <= -1) return baseline + offset
    return offset
  }
}
