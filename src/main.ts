import { app, BrowserWindow, screen } from "electron";
import { ViewPane } from "./view-pane";

app.on("ready", init);

function init(): void {

  const win = createWindow();

  const heightView2 = 320;

  const view1 = new ViewPane(
    "https://www.grammarly.com/signin?allowUtmParams=true",
    () => {
     return {
       height: win.getBounds().height - heightView2,
       width: win.getBounds().width,
       x: 0,
       y: 0,
     };
    },
  );

  const view2 = new ViewPane(
    "https://translate.google.com/",
    () => {
      return {
        height: heightView2,
        width: win.getBounds().width,
        x: 0,
        y: win.getBounds().height - heightView2,
      };
    },
`
      header.gb_la { display: none !important; }
      .frame { border-top: 3px solid black !important; padding-bottom: 66px !important; }
    `,
  );

  applyViews(win, view1, view2);
}

function createWindow(): BrowserWindow {
  const workArea = screen.getPrimaryDisplay().workArea;
  return new BrowserWindow({
    height: workArea.height,
    width: workArea.width,
  });
}

function applyViews(win: BrowserWindow, ...views: ViewPane[]) {
  views.forEach((view) => {
    win.addBrowserView(view.getBrowserView());
    view.setBounds();
    view.loadURL();
    view.insertCSS();
  });

  win.on("resize", () => {
    views.forEach((view) => {
      view.setBounds();
    });
  });
}
