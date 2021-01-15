import { BrowserView, Rectangle } from "electron";
import BrowserWindow = Electron.BrowserWindow;

export interface IViewPaneConf {
  url: string;
  boundsFn: () => Rectangle;
  css?: string;
  useragent?: string;
}

export class ViewPane {

  public static create(): BrowserView {
    return new BrowserView({
      webPreferences: {
        contextIsolation: true
      },
    });
  }

  private readonly browserView: BrowserView;
  private readonly boundsFn: () => Rectangle;
  private readonly url: string;
  private readonly css?: string;
  private readonly useragent?: string;

  private parent?: BrowserWindow;

  constructor(conf: IViewPaneConf) {
    this.browserView = ViewPane.create();
    this.boundsFn = conf.boundsFn;
    this.url = conf.url;
    this.css = conf.css;
    this.useragent = conf.useragent;
  }

  public addTo(win: BrowserWindow): void {
    this.parent = win;
    this.parent.addBrowserView(this.browserView);
  }

  public loadURL(): Promise<void> {
    if (this.useragent) {
      this.browserView.webContents.setUserAgent(this.useragent)
    }
    return this.browserView.webContents.loadURL(this.url);
  }

  public insertCSS(): Promise<string> {
    return new Promise((resolve) => {
      if (this.css) {
        this.browserView.webContents.on("dom-ready", () => {
          resolve(this.browserView.webContents.insertCSS(this.css));
        });

      } else {
        resolve('');
      }
    });
  }

  public updateBounds(): void {
    this.browserView.setBounds(this.boundsFn());
  }
}
