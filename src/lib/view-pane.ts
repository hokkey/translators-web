import { BrowserView, Rectangle } from "electron";

export interface IViewPaneConf {
  url: string;
  boundsFn: () => Rectangle;
  css?: string;
}

export class ViewPane {

  public static create(): BrowserView {
    return new BrowserView({
      webPreferences: {
        nodeIntegration: false,
      },
    });
  }

  private readonly browserView: BrowserView;
  private readonly boundsFn: () => Rectangle;
  private readonly url: string;
  private readonly css?: string;

  constructor(conf: IViewPaneConf) {
    this.browserView = ViewPane.create();
    this.boundsFn = conf.boundsFn;
    this.url = conf.url;
    this.css = conf.css;
  }

  public getBrowserView(): BrowserView {
    return this.browserView;
  }

  public loadURL(): void {
    this.browserView.webContents.loadURL(this.url);
  }

  public insertCSS(): void {
    if (this.css) {
      this.browserView.webContents.on("dom-ready", () => {
        this.browserView.webContents.insertCSS(this.css);
      });
    }
  }

  public setBounds(): void {
    this.browserView.setBounds(this.boundsFn());
  }
}
