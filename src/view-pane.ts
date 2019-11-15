import { BrowserView, Rectangle } from "electron";

export class ViewPane {

  public static create(): BrowserView {
    const viewConfig = {
      webPreferences: {
        nodeIntegration: false,
      },
    };

    return new BrowserView(viewConfig);
  }

  public browserView: BrowserView;
  public boundsFn: () => Rectangle;
  public url: string;
  public css?: string;

  constructor(url: string, boundsFn: () => Rectangle, css?: string) {
    this.browserView = ViewPane.create();
    this.url = url;
    this.boundsFn = boundsFn;
    this.css = css;
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

  public getBrowserView(): BrowserView {
    return this.browserView;
  }

  public setBounds(): void {
    this.browserView.setBounds(this.boundsFn());
  }
}
