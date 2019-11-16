"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var view_pane_1 = require("./lib/view-pane");
electron_1.app.on("ready", init);
function init() {
    var win = createWindow();
    var heightView2 = 320;
    var view1 = new view_pane_1.ViewPane("https://www.grammarly.com/signin?allowUtmParams=true", function () {
        return {
            height: win.getBounds().height - heightView2,
            width: win.getBounds().width,
            x: 0,
            y: 0
        };
    });
    var view2 = new view_pane_1.ViewPane("https://translate.google.com/", function () {
        return {
            height: heightView2,
            width: win.getBounds().width,
            x: 0,
            y: win.getBounds().height - heightView2
        };
    }, "\n      header.gb_la { display: none !important; }\n      .frame { border-top: 3px solid black !important; padding-bottom: 66px !important; }\n    ");
    applyViews(win, view1, view2);
}
function createWindow() {
    var workArea = electron_1.screen.getPrimaryDisplay().workArea;
    return new electron_1.BrowserWindow({
        height: workArea.height,
        width: workArea.width
    });
}
function applyViews(win) {
    var views = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        views[_i - 1] = arguments[_i];
    }
    views.forEach(function (view) {
        win.addBrowserView(view.getBrowserView());
        view.setBounds();
        view.loadURL();
        view.insertCSS();
    });
    win.on("resize", function () {
        views.forEach(function (view) {
            view.setBounds();
        });
    });
}
//# sourceMappingURL=main.js.map