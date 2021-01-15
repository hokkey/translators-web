import { app, BrowserWindow, screen } from "electron";
import * as CONST from "./constants";
import {IViewPaneConf, ViewPane} from "./lib/view-pane";

app.on("ready", () => {

  const win = createWindow();
  const panel = createPanel([
    {
      boundsFn: () => {
        return {
          height: win.getBounds().height - CONST.GOOGLE_TRANSLATOR_HEIGHT,
          width: win.getBounds().width,
          x: 0,
          y: 0,
        };
      },
      url: CONST.GRAMMARLY_URL,
    },
    {
      boundsFn: () => {
        return {
          height: CONST.GOOGLE_TRANSLATOR_HEIGHT,
          width: win.getBounds().width,
          x: 0,
          y: win.getBounds().height - CONST.GOOGLE_TRANSLATOR_HEIGHT,
        };
      },
      css: CONST.GOOGLE_TRANSLATOR_CUSTOM_CSS,
      url: CONST.GOOGLE_TRANSLATOR_URL,
    },
  ]);

  applyPanel(win, ...panel);
  win.on("resize", createOnResizeFn(...panel));

});

function createWindow(): BrowserWindow {
  const workArea = screen.getPrimaryDisplay().workArea;
  return new BrowserWindow({
    height: Math.min(workArea.height, CONST.MAX_INITIAL_WIN_HEIGHT),
    width: Math.min(workArea.width, CONST.MAX_INITIAL_WIN_WIDTH),
    webPreferences: {
      contextIsolation: true
    }
  });
}

function createPanel(configs: IViewPaneConf[]): ViewPane[] {
  return configs.map((conf) => new ViewPane(conf));
}

function applyPanel(win: BrowserWindow, ...panel: ViewPane[]) {
  panel.forEach((pane) => {
    pane.addTo(win);
    pane.updateBounds();
    pane.loadURL();
    pane.insertCSS();
  });
}

function createOnResizeFn(...panel: ViewPane[]) {
  return () => {
    panel.forEach((pane) => pane.updateBounds());
  };
}
