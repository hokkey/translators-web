"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var electron_1 = require("electron");
var view_pane_1 = require("./lib/view-pane");
var GRAMMARLY_URL = "https://www.grammarly.com/signin?allowUtmParams=true";
var GOOGLE_TRANSLATOR_URL = "https://translate.google.com/";
var GOOGLE_TRANSLATOR_HEIGHT = 320;
var GOOGLE_TRANSLATOR_CUSTOM_CSS = "\n  header.gb_la { display: none !important; }\n  .frame { border-top: 3px solid black !important; padding-bottom: 66px !important; }\n";
electron_1.app.on("ready", function () {
    var win = createWindow();
    var viewConfigs = [
        {
            boundsFn: function () {
                return {
                    height: win.getBounds().height - GOOGLE_TRANSLATOR_HEIGHT,
                    width: win.getBounds().width,
                    x: 0,
                    y: 0
                };
            },
            url: GRAMMARLY_URL
        },
        {
            boundsFn: function () {
                return {
                    height: GOOGLE_TRANSLATOR_HEIGHT,
                    width: win.getBounds().width,
                    x: 0,
                    y: win.getBounds().height - GOOGLE_TRANSLATOR_HEIGHT
                };
            },
            css: GOOGLE_TRANSLATOR_CUSTOM_CSS,
            url: GOOGLE_TRANSLATOR_URL
        },
    ];
    var panel = createPanel(viewConfigs);
    applyPanel.apply(void 0, __spreadArrays([win], panel));
    win.on("resize", createOnResizeFn.apply(void 0, panel));
});
function createWindow() {
    var workArea = electron_1.screen.getPrimaryDisplay().workArea;
    return new electron_1.BrowserWindow({
        height: workArea.height,
        width: workArea.width
    });
}
function createPanel(configs) {
    return configs.map(function (conf) {
        return new view_pane_1.ViewPane(conf);
    });
}
function applyPanel(win) {
    var panel = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        panel[_i - 1] = arguments[_i];
    }
    panel.forEach(function (pane) {
        win.addBrowserView(pane.getBrowserView());
        pane.setBounds();
        pane.loadURL();
        pane.insertCSS();
    });
}
function createOnResizeFn() {
    var panel = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        panel[_i] = arguments[_i];
    }
    return function () {
        panel.forEach(function (pane) {
            pane.setBounds();
        });
    };
}
//# sourceMappingURL=main.js.map