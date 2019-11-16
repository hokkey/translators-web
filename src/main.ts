import { app, BrowserWindow, screen } from "electron";
import {IViewPaneConf, ViewPane} from "./lib/view-pane";

const GRAMMARLY_URL = "https://www.grammarly.com/signin?allowUtmParams=true";
const GOOGLE_TRANSLATOR_URL = "https://translate.google.com/";
const GOOGLE_TRANSLATOR_HEIGHT = 320;
const GOOGLE_TRANSLATOR_CUSTOM_CSS = `
  header.gb_la { display: none !important; }
  .frame { border-top: 3px solid black !important; padding-bottom: 66px !important; }
`;

app.on("ready", () => {

  const win = createWindow();

  const viewConfigs: IViewPaneConf[] = [
    {
      boundsFn: () => {
        return {
          height: win.getBounds().height - GOOGLE_TRANSLATOR_HEIGHT,
          width: win.getBounds().width,
          x: 0,
          y: 0,
        };
      },
      url: GRAMMARLY_URL,
    },
    {
      boundsFn: () => {
        return {
          height: GOOGLE_TRANSLATOR_HEIGHT,
          width: win.getBounds().width,
          x: 0,
          y: win.getBounds().height - GOOGLE_TRANSLATOR_HEIGHT,
        };
      },
      css: GOOGLE_TRANSLATOR_CUSTOM_CSS,
      url: GOOGLE_TRANSLATOR_URL,
    },
  ];

  const panel = createPanel(viewConfigs);

  applyPanel(win, ...panel);

  win.on("resize", createOnResizeFn(...panel));

});


function createWindow(): BrowserWindow {
  const workArea = screen.getPrimaryDisplay().workArea;
  return new BrowserWindow({
    height: workArea.height,
    width: workArea.width,
  });
}

function createPanel(configs: IViewPaneConf[]): ViewPane[] {
  return configs.map((conf) => {
    return new ViewPane(conf);
  });
}

function applyPanel(win: BrowserWindow, ...panel: ViewPane[]) {
  panel.forEach((pane) => {
    win.addBrowserView(pane.getBrowserView());
    pane.setBounds();
    pane.loadURL();
    pane.insertCSS();
  });
}

function createOnResizeFn(...panel: ViewPane[]) {
  return () => {
    panel.forEach((pane) => {
      pane.setBounds();
    });
  };
}
